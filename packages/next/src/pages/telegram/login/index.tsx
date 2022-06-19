import DefaultScreen from "../../../components/DefaultScreen";
import { getFirebaseConfig, FirebaseConfigType } from '../../../helper';
import { getApp, initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import tag from '../../../config/tag.json';
import { useRef, useState } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from "axios";
import useSheet from "../../../hooks/sheet";
import useUser from "../../../hooks/user";
import { useRouter } from 'next/router'
const Login = () => {
    const router = useRouter();
    const { query = {} } = router;
    const { token } = query;
    const email = useRef('');
    const password = useRef('');
    const [isLoading, setLoading] = useState(false);
    const [isForgetPassword, setForgetPassword] = useState(false);
    const [, setSheet] = useSheet();
    const [, setUser] = useUser();
    const checkSheetSettings = async ({ API_KEY, API_SECRET }: {
        API_KEY: string,
        API_SECRET: string
    }) => {
        try {
            const response = await axios.get('/api/v1/sheets/settings', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api_key': API_KEY,
                    'x-api_secret': API_SECRET
                }
            });
            const data = response.data;
            if (data && data.currentSheet) {
                setSheet({
                    sheetId: data.currentSheet,
                    sheetUrl: data.currentSheetLink,
                    name: data.name
                })
                router.push(`/home`);
            } else {
                router.push(`/onboarding`);
            }
        } catch (error) {
            router.push(`/onboarding`);
        }
    }


    const login = async () => {
        setLoading(true);
        const schema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required(),
        });
        let data;
        try {
            const validate = await schema.validate({
                email: email.current,
                password: password.current,
            }, {
                abortEarly: false,
            })
            data = validate;
        } catch (error: any) {
            if (error && error.errors) {
                error.errors.forEach((err: any) => {
                    toast.error(err);
                })
            }
            setLoading(false);
            return false;
        }

        let app;
        const config: FirebaseConfigType = getFirebaseConfig();
        const firebaseConfigureJson = {
            apiKey: config.FIREBASE_API_KEY,
            authDomain: config.FIREBASE_AUTH_DOMAIN,
            projectId: config.PROJECT_ID,
            storageBucket: config.STORAGE_BUCKET,
            messagingSenderId: config.MESSAGING_SENDER_ID,
            appId: config.APP_ID,
        };
        try {
            const firebaseApps = getApp(tag.firebaseTag);
            app = firebaseApps;
        } catch (error) {
            app = initializeApp(firebaseConfigureJson, tag.firebaseTag);
        }
        try {
            // const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            // const data: any = await sendPasswordResetEmail(auth,'abhijith@appmaker.xyz')
            const response: any = await signInWithEmailAndPassword(auth, data.email, data.password);
            const { accessToken } = (response && response.user) || {};
            const result = await axios.post('/api/v1/user/login', {
                accessToken,
                telegramToken:token
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            setUser({ ...result.data, accessToken });
            checkSheetSettings({
                API_KEY: result.data.API_KEY,
                API_SECRET: result.data.API_SECRET
            });
        } catch (error: any) {
            toast.error(error.message || 'Verification failed')

        }
        setLoading(false);
    }

    const forgetPassword = async () => {
        setForgetPassword(true);
        const schema = yup.object().shape({
            email: yup.string().email().required(),
        })
        let data: any;
        try {
            data = await schema.validate({
                email: email.current,
            })
        } catch (error: any) {
            if (error && error.errors) {
                error.errors.forEach((err: any) => {
                    toast.error(err);
                })
            } else {
                toast.error(error.message || 'Something went wrong');
            }
            return setForgetPassword(false)
        }
        let app;
        const config: FirebaseConfigType = getFirebaseConfig();
        const firebaseConfigureJson = {
            apiKey: config.FIREBASE_API_KEY,
            authDomain: config.FIREBASE_AUTH_DOMAIN,
            projectId: config.PROJECT_ID,
            storageBucket: config.STORAGE_BUCKET,
            messagingSenderId: config.MESSAGING_SENDER_ID,
            appId: config.APP_ID,
        };
        try {
            const firebaseApps = getApp(tag.firebaseTag);
            app = firebaseApps;
        } catch (error) {
            app = initializeApp(firebaseConfigureJson, tag.firebaseTag);
        }
        const auth = getAuth(app);
        // const data: any = await sendPasswordResetEmail(auth,'abhijith@appmaker.xyz')
        try {
            await sendPasswordResetEmail(auth, data.email);
            toast.success('Password reset email sent successfully');
            toast.info('Please check your email');

        } catch (error: any) {
            toast.error(error.message || 'Password reset failed')
        }
        setForgetPassword(false);

    }

    return <DefaultScreen>
        <div className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        onChange={(event) => { email.current = event.target.value }}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-black"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={(event) => { password.current = event.target.value }}
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-black"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div> */}

                <div className="text-sm">
                    <button className="font-medium text-indigo-600 hover:text-indigo-500"
                        disabled={isLoading || isForgetPassword}
                        onClick={forgetPassword}
                    >
                        {isForgetPassword ? 'Please wait...' : 'Forgot your password?'}
                    </button>
                </div>
            </div>

            <div>
                <button
                    type="button"
                    onClick={login}
                    disabled={isLoading || isForgetPassword}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </div>

        </div>
    </DefaultScreen>
}

export default Login;