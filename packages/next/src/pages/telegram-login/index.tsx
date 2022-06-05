import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react';
import * as firebase from 'firebase/app';
import * as firestore from 'firebase/firestore/lite';
import tag from '../../config/tag.json';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { generateToken, generateKey, getFirebaseConfig } from '../../helper';
import axios from 'axios';

const TelegramLogin = () => {
  const config: any = getFirebaseConfig();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { chatId } = router.query;
  if (!chatId) {
    return null;
  }
  const login = async () => {
    setLoading(true);
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
      const firebaseApps = firebase.getApp(tag.firebaseTag);
      app = firebaseApps;
    } catch (error) {
      app = firebase.initializeApp(firebaseConfigureJson, tag.firebaseTag);
    }
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const db = firestore.getFirestore(app);
    try {
      const result = await signInWithPopup(auth, provider);
      const updateRef = firestore.doc(
        db,
        tag.userCollectionTag,
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
        API_SECRET,
      });
      await axios.post(`/api/v1/integrations/telegram/configure`, {
        API_SECRET: API_SECRET,
        CHAT_ID: chatId,
        uid: result.user.uid,
        email: result.user.email,
      });
      if (window)
        window.location.href = 'https://telegram.me/expenser_scheduler_bot';
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-slate-900 p-6 rounded flex flex-col items-center">
        <h3 className="text-lg font-medium text-white mb-4">
          Continue with google
        </h3>
        <button
          disabled={isLoading}
          onClick={() => {
            login();
            // if (window)
            //     window.location.href = 'https://telegram.me/abhisawzm_bot';
          }}
          className="hover:bg-white hover:text-black flex items-center justify-center space-x-2 text-white   border border-white px-4 py-2 text-xl">
          <Image
            src="/images/google-logo.png"
            alt="google-logo"
            height={30}
            width={30}
            quality={100}
          />
          {isLoading ? 'Loading..' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default TelegramLogin;
