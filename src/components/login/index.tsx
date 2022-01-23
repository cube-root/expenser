
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as firebase from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import firebaseConfig from '../../config/firebase-config.json';
import styles from '../../styles/Home.module.css'
import { useState } from 'react';
let firebaseTag = 'login'

const Login = ({callBackAfterLogin=()=>{}}) => {
    // const { accessToken } = useStore();
    const [accessToken,setAccessToken] = useState<any>(undefined);
    const router = useRouter();
    const googleLogin = () => {
        let app;
        let config = {};
        const firebaseConfigureJson = {
            apiKey: process.env.FIREBASE_API_KEY || config.apiKey,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN ||  config.authDomain,
            projectId: process.env.PROJECT_ID ||  config.projectId,
            storageBucket: process.env.STORAGE_BUCKET ||  config.storageBucket,
            messagingSenderId: process.env.MESSAGING_SENDER_ID ||  config.messagingSenderId,
            appId: process.env.APP_ID || config.appId,
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
                console.log(JSON.stringify(result))
                // store.setUserDetails(result.user)
                // store.setAccessToken(result._tokenResponse.oauthAccessToken)
                if(global){
                    global.sessionStorage.setItem('accessToken', result._tokenResponse.oauthAccessToken)
                    global.sessionStorage.setItem('sign-in',JSON.stringify(result))
                    setAccessToken(result._tokenResponse.oauthAccessToken)
                }
            })
            .catch(console.error)
    }

    useEffect(() => {
        // if (accessToken) {
        //     router.push('/list')
        // }
        if(accessToken && callBackAfterLogin){
            return callBackAfterLogin()
        }
    }, [accessToken])
    
    return (
        <div className={styles.main}>
            <button onClick={googleLogin}>
                <div
                    className="h-10 w-10 self-center"
                >
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        className="svg-inline--fa fa-google fa-w-16"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        >
                        </path>
                    </svg>
                </div>
                Login
            </button>
        </div>
    )
}


export default Login;