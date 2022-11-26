import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Login } from '../components';
import useUser from '../hooks/user';
import useSheet from '../hooks/sheet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Mode from '../components/mode';
import useMode from '../hooks/mode';

const Home = () => {
  const [isLoading, setLoading] = useState(false);
  const { darkMode, toggleMode: setDarkMode } = useMode();
  const router = useRouter();
  const [user, setUser] = useUser();
  const [, setSheet] = useSheet();
  const checkSheetSettings = async ({
    API_KEY,
    API_SECRET,
  }: {
    API_KEY: string;
    API_SECRET: string;
  }) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/sheets/settings', {
        headers: {
          'Content-Type': 'application/json',
          'x-api_key': API_KEY,
          'x-api_secret': API_SECRET,
        },
      });
      const data = response.data;
      if (data && data.currentSheet) {
        setSheet({
          sheetId: data.currentSheet,
          sheetUrl: data.currentSheetLink,
          name: data.name,
          general: data.general
        });
        router.push(`/home`);
      } else {
        router.push(`/onboarding`);
      }
    } catch (error) {
      router.push(`/onboarding`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      user &&
      user.API_KEY &&
      user.API_SECRET &&
      user.API_KEY.length > 0 &&
      user.API_SECRET.length > 0
    ) {
      checkSheetSettings({
        API_KEY: user.API_KEY,
        API_SECRET: user.API_SECRET,
      });
    }
  }, []);
  const loginCallBack = (data: any) => {
    setUser({ ...data });
    checkSheetSettings({
      API_KEY: data.API_KEY,
      API_SECRET: data.API_SECRET,
    });
  };
  return (
    <div className="bg-white h-screen w-full dark:bg-slate-900 relative">
      <div className="flex flex-col items-center px-4 justify-start sm:justify-center pt-4 sm:pt-0 h-full space-y-4 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between w-full max-w-4xl sm:justify-center">
          <Image
            src={darkMode ? '/logo/straight-white.svg' : '/logo/straight.svg'}
            alt="logo"
            width={150}
            height={50}
          />
          <div className="flex items-center space-x-4 sm:absolute sm:right-4 sm:top-4">
            <Link
              href={'https://github.com/cube-root/expenser'}
              passHref={true}>
              <a className="bg-slate-100 p-2 inline-flex rounded-full">
                <Image
                  src="/images/github.svg"
                  alt="logo"
                  width={20}
                  height={20}
                />
              </a>
            </Link>
            <Mode darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>
        <div className="w-full relative h-1/2 sm:h-1/3 top-8">
          <Image
            src={
              darkMode
                ? '/images/intro-image-dark.png'
                : '/images/intro-image.png'
            }
            alt="logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="flex items-center flex-col space-y-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl mb-2">Your data belongs to You!</h1>
            <p className="text-sm">
              Manage you personal bills using{' '}
              <span className="text-green-600">Google Sheets</span>
            </p>
          </div>
          <Login callBack={loginCallBack} forceLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Home;
