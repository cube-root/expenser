import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LoginPage = () => {
  const router = useRouter();
  useEffect(()=>{
    router.push('/');
  },[])
  return null;
};


export default LoginPage;
