
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as firebase from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import firebaseConfig from '../../config/firebase-config.json';
import styles from '../../styles/Home.module.css'
import { useState } from 'react';
import { NextPage } from 'next';
let firebaseTag = 'login'

type Props = {
    callBackAfterLogin: Function,
    firebaseConfig: {
        FIREBASE_API_KEY: String | any,
        FIREBASE_AUTH_DOMAIN: String | any,
        PROJECT_ID: String | any,
        STORAGE_BUCKET: String | any,
        MESSAGING_SENDER_ID: String | any,
        APP_ID: String | any,
    }
}
const Login: NextPage | any = ({ callBackAfterLogin = () => { }, firebaseConfig: config }: Props) => {
    // const { accessToken } = useStore();
    const [accessToken, setAccessToken] = useState<any>(undefined);
    const router = useRouter();

    const googleLogin = () => {
        let app;
        const firebaseConfigureJson = {
            apiKey: config.FIREBASE_API_KEY,
            authDomain: config.FIREBASE_AUTH_DOMAIN,
            projectId: config.PROJECT_ID,
            storageBucket: config.STORAGE_BUCKET,
            messagingSenderId: config.MESSAGING_SENDER_ID,
            appId: config.APP_ID,
        }
        try {
            const firebaseApps = firebase.getApp(firebaseTag);
            app = firebaseApps
        } catch (error) {
            app = firebase.initializeApp(firebaseConfigureJson, firebaseTag)
        }
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        // provider.addScope('https://www.googleapis.com/auth/firebase');
        // provider.addScope('https://www.googleapis.com/auth/cloudplatformprojects');
        // provider.addScope('https://www.googleapis.com/auth/cloud-platform');

        provider.addScope('https://www.googleapis.com/auth/drive');
        provider.addScope('https://www.googleapis.com/auth/drive.readonly');
        provider.addScope('https://www.googleapis.com/auth/drive.file')
        provider.addScope('https://www.googleapis.com/auth/spreadsheets');
        provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');
        signInWithPopup(auth, provider)
            .then((result: any) => {
                // store.setUserDetails(result.user)
                // store.setAccessToken(result._tokenResponse.oauthAccessToken)
                if (global) {
                    global.sessionStorage.setItem('accessToken', result._tokenResponse.oauthAccessToken)
                    global.sessionStorage.setItem('sign-in', JSON.stringify(result))
                    setAccessToken(result._tokenResponse.oauthAccessToken)
                }
            })
            .catch(console.error)
    }

    useEffect(() => {
       
        if (accessToken && callBackAfterLogin) {
            return callBackAfterLogin()
        }
    }, [accessToken])
    return (
        <div className='grid grid-cols-1 gap-1 place-items-center content-center pt-96'>
            <button
                onClick={googleLogin}
                className='hover:bg-white hover:text-black flex flex-col items-center text-white text-mono border border-white p-4 w-48   text-xl rounded-3xl'>
                <img src="https://img.icons8.com/fluency/48/000000/google-logo.png" />
                Login
            </button>
        </div>
    )
}



export default Login;