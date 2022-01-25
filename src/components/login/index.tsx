
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
                console.log(JSON.stringify(result))
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
        // if (accessToken) {
        //     router.push('/list')
        // }
        if (accessToken && callBackAfterLogin) {
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