import { Login } from '../../components';
import styles from '../../styles/Home.module.css'
import { useRouter } from 'next/router';

const LoginPage = () => {
    const router = useRouter();

    const loginCallBack = ()=>{
        router.push('/home');
    }
    return (
        <div className={styles.container}>
            <Login callBackAfterLogin={loginCallBack}/>
            <footer className={styles.footer}>
                <span>Expenser</span>
            </footer>
        </div>
    )
}

export default LoginPage