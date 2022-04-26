import { useEffect } from 'react';
import * as firebase from 'firebase/app';
import * as firestore from "firebase/firestore/lite";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { NextPage } from 'next';
import UseAccessToken from '../../hooks/access-token';
import { firebaseTag, firestoreUserCollectionTag } from '../../config/tag';
import UseLocal  from '../../hooks/local-storage';
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
  const [,setLocal] = UseLocal();
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
    provider.addScope('https://www.googleapis.com/auth/drive');
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
    signInWithPopup(auth, provider)
      .then(async (result: any) => {
        const updateRef = firestore.doc(db, firestoreUserCollectionTag, result.user.uid);
        await firestore.setDoc(updateRef,
          {
            name: result.user.displayName,
            email: result.user.email,
            photoUrl: result.user.photoURL,
            displayName: result.user.displayName,
            token: result._tokenResponse.oauthAccessToken,
            uid: result.user.uid 
          });
        setSessionToken({ token: result._tokenResponse.oauthAccessToken, uid: result.user.uid });
        setAccessToken(result._tokenResponse.oauthAccessToken);
        setLocal({
            photoUrl: result.user.photoURL,
            displayName: result.user.displayName,
            accessToken: result._tokenResponse.oauthAccessToken,
            uid: result.user.uid 
        })
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (accessToken && callBackAfterLogin) {
      return callBackAfterLogin();
    }
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="grid grid-cols-1 gap-1 place-items-center content-center pt-96">
      <button
        onClick={googleLogin}
        className="hover:bg-white hover:text-black flex flex-col items-center text-white font-mono border border-white p-4 w-48   text-xl rounded-3xl"
      >
        <img
          src="https://img.icons8.com/fluency/48/000000/google-logo.png"
          alt="google-logo"
        />
        Login
      </button>
    </div>
  );
};

export default Login;
