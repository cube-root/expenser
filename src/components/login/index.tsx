import { useEffect } from 'react';
import * as firebase from 'firebase/app';
import * as firestore from 'firebase/firestore/lite';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { NextPage } from 'next';
import UseAccessToken from '../../hooks/access-token';
import { firebaseTag, firestoreUserCollectionTag } from '../../config/tag';
import UseLocal from '../../hooks/local-storage';
import Image from 'next/image';
import { generateToken, generateKey } from '../../helper';
type CallBackFunction = () => any;
type Props = {
  callBackAfterLogin: CallBackFunction;
  firebaseConfig: {
    FIREBASE_API_KEY: string | any;
    FIREBASE_AUTH_DOMAIN: string | any;
    PROJECT_ID: string | any;
    STORAGE_BUCKET: string | any;
    MESSAGING_SENDER_ID: string | any;
    APP_ID: string | any;
  };
};
const Login: NextPage | any = ({
  callBackAfterLogin = () => undefined, // NOTE: Check for mistakes.
  firebaseConfig: config,
}: Props) => {
  const [accessToken, setAccessToken] = useState<any>(undefined);
  const [setSessionToken] = UseAccessToken();
  const [, setLocal] = UseLocal();
  const googleLogin = () => {
    let app;
    const firebaseConfigureJson = {
      apiKey: config.FIREBASE_API_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.PROJECT_ID,
      storageBucket: config.STORAGE_BUCKET,
      messagingSenderId: config.MESSAGING_SENDER_ID,
      appId: config.APP_ID,
    };
    try {
      const firebaseApps = firebase.getApp(firebaseTag);
      app = firebaseApps;
    } catch (error) {
      app = firebase.initializeApp(firebaseConfigureJson, firebaseTag);
    }
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const db = firestore.getFirestore(app);
    // const collection: any = firestore.collection(db, firestoreUserCollectionTag);
    // provider.addScope('https://www.googleapis.com/auth/drive');
    // provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    // provider.addScope('https://www.googleapis.com/auth/drive.file');
    // provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    // provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
    signInWithPopup(auth, provider)
      .then(async (result: any) => {
        const updateRef = firestore.doc(
          db,
          firestoreUserCollectionTag,
          result.user.uid,
        );
        const userRef = await firestore.getDoc(updateRef);

        let API_KEY;
        let API_SECRET;
        if (userRef.exists() && userRef.data().API_KEY) {
          API_KEY = userRef.data().API_KEY;
        } else {
          API_KEY = generateToken({
            uid: result.user.uid,
            email: result.user.email,
          });
        }
        if (userRef.exists() && userRef.data().API_KEY) {
          API_SECRET = userRef.data().API_SECRET;
        } else {
          API_SECRET = generateKey();
        }
        await firestore.setDoc(updateRef, {
          name: result.user.displayName,
          email: result.user.email,
          photoUrl: result.user.photoURL,
          displayName: result.user.displayName,
          uid: result.user.uid,
          login_at: new Date(),
          API_KEY,
          API_SECRET
        });
        setSessionToken({
          token: result._tokenResponse.oauthAccessToken,
          uid: result.user.uid,
        });
        setAccessToken(result._tokenResponse.oauthAccessToken);
        setLocal({
          photoUrl: result.user.photoURL,
          displayName: result.user.displayName,
          accessToken: result._tokenResponse.oauthAccessToken,
          uid: result.user.uid,
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (accessToken && callBackAfterLogin) {
      return callBackAfterLogin();
    }
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-slate-900 p-6 rounded flex flex-col items-center">
        <h3 className="text-lg font-medium text-white mb-4">
          Continue with google
        </h3>
        <button
          onClick={googleLogin}
          className="hover:bg-white hover:text-black flex items-center justify-center space-x-2 text-white font-mono border border-white px-4 py-2 text-xl">
          <Image
            src="/images/google-logo.png"
            alt="google-logo"
            height={30}
            width={30}
            quality={100}
          />
          <span>Login</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
