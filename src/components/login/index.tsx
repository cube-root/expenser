
import * as firebase from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseConfig from '../../config/firebase-config.json';
import store, { useStore } from '../../store';

let firebaseTag = 'login'

const Login = () => {
    const { accessToken } = useStore();
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
                store.setUserDetails(result.user.accessToken)
                store.setAccessToken(result.user.accessToken)
            })
            .catch(console.error)
    }


    return <div><button onClick={googleLogin}>Login</button></div>
}


export default Login;