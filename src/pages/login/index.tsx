import { Login } from '../../components';
import styles from '../../styles/Home.module.css'

const LoginPage = () => {

    return (
        <div className={styles.container}>
            <Login />
            <footer className={styles.footer}>
                <span>Expenser</span>
            </footer>
        </div>
    )
}

export default LoginPage