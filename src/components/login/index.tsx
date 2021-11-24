
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as firebase from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseConfig from '../../config/firebase-config.json';
import store, { useStore } from '../../store';
import styles from '../../styles/Home.module.css'
let firebaseTag = 'login'

const Login = () => {
    const { accessToken } = useStore();
    const router = useRouter()
    const googleLogin = () => {
        let app;

        try {
            const firebaseApps = firebase.getApp(firebaseTag);
            app = firebaseApps
        } catch (error) {
            app = firebase.initializeApp(firebaseConfig, firebaseTag)
        }
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        provider.addScope('https://www.googleapis.com/auth/firebase');
        provider.addScope('https://www.googleapis.com/auth/cloudplatformprojects');
        signInWithPopup(auth, provider)
            .then((result: any) => {
                store.setUserDetails(result.user)
                store.setAccessToken(result.user.accessToken)
            })
            .catch(console.error)
    }

    useEffect(() => {
        if (accessToken) {
            router.push('/dashboard')
        }
    }, [accessToken])
    return (
        <div className={styles.main}>
            <button onClick={googleLogin}>
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
                Login
            </button>
        </div>
    )
}


export default Login;