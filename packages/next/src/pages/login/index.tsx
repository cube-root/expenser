import { Login } from '../../components';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();

  const loginCallBack = () => {
    router.push('/home');
  };
  return (
    <div className="bg-black h-screen w-screen">
      <Login callBackAfterLogin={loginCallBack} />
    </div>
  );
};


export default LoginPage;
