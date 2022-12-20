import Image from 'next/image';
import { useState } from 'react';
import { getFirebaseConfig } from '../utils';
import { getApp, initializeApp } from 'firebase/app';
import { firebaseTags as tag } from '../config';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const GoogleLogin = () => {
  const [isLoading, setLoading] = useState(false);
  const config = getFirebaseConfig();
  const onSuccess = async(accessToken:string)=>{
      try {
        const response = await axios.post('/api/v1/oauth/google',{
          accessToken
        },{
          headers:{
            'Content-Type':'application/json'
          }
        })
        
      } catch (error) {
        console.log(error);
      }
  }
  const onLogin = async () => {
    setLoading(true);
    const firebaseConfigureJson = {
      apiKey: config.FIREBASE_API_KEY,
      authDomain: config.FIREBASE_AUTH_DOMAIN,
      projectId: config.PROJECT_ID,
      storageBucket: config.STORAGE_BUCKET,
      messagingSenderId: config.MESSAGING_SENDER_ID,
      appId: config.APP_ID,
    };
    let app;
    try {
      try {
        const firebaseApps = getApp(tag.firebaseTag);
        app = firebaseApps;
      } catch (error) {
        app = initializeApp(firebaseConfigureJson, tag.firebaseTag);
      }
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const data: any = await signInWithPopup(auth, provider);
      const { accessToken } = (data && data.user) || {};
      console.log(accessToken);
      await onSuccess(accessToken);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button
        className="flex items-center justify-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full"
        onClick={onLogin}
        disabled={isLoading}>
        <Image
          src="/images/google-logo.png"
          alt="logo"
          width={20}
          height={20}
        />
        {isLoading && <span className="ml-2 text-lg">Signing In...</span>}
        {!isLoading && <span className="ml-2 text-lg">Login with Google</span>}
      </button>
    </div>
  );
};

export default GoogleLogin;
