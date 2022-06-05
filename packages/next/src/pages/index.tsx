import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Login } from '../components';

const SplashScreen = () => {
  return (
    <div className="bg-white h-screen w-full dark:bg-slate-900">
      <div className="flex justify-center items-center h-full">
        <Image src="/logo/stacked.svg" alt="logo" width={150} height={150} />
      </div>
    </div>
  );
};

const GetStarted = ({ darkMode }: { darkMode: boolean }) => {
  const router = useRouter();

  const loginCallBack = () => {
    router.push('/home');
  };

  return (
    <div className="bg-white h-screen w-full dark:bg-slate-900 relative">
      <div className="flex flex-col items-center px-4 justify-center h-full space-y-4 text-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between w-full max-w-4xl sm:justify-center">
          <Image
            src={darkMode ? '/logo/straight-white.svg' : '/logo/straight.svg'}
            alt="logo"
            width={150}
            height={50}
          />
          <Link href={'https://github.com/cube-root/expenser'} passHref={true}>
            <a className="bg-slate-100 p-2 rounded-full inline-flex sm:absolute sm:top-4 sm:right-4">
              <Image
                src="/images/github.svg"
                alt="logo"
                width={20}
                height={20}
              />
            </a>
          </Link>
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
          <Login callBackAfterLogin={loginCallBack} />
        </div>
      </div>
    </div>
  );
};

const Home = ({ darkMode }: { darkMode: boolean }) => {
  const router = useRouter();
  return <GetStarted darkMode={darkMode} />;
};

export default Home;

{
  /* <div className="bg-black h-screen w-screen">
      <div className="flex flex-row top-0  justify-between mx-10 pt-10  ">
        <p className="text-white  ">Expenser</p>
        <a
          href="https://github.com/cube-root/expenser"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://img.icons8.com/color-glass/48/000000/github.png"
            alt="github logo"
          />
        </a>
      </div>
      <div className="  text-white place-items-center grid grid-cols-1 gap-1 content-center pt-56">
        <div className="p-2">
          <p className="text-xl p-2">
            Your data belongs to You <span className="animate-ping"> !</span>
          </p>
        </div>
        <div className="p-2">
          <p className="text-sm p-2">
            Manage you personal bills using Google Sheets
          </p>
        </div>
        <div className="border border-white p-2 mt-10  hover:bg-white hover:text-black">
          <button
            className="p-2"
            onClick={() => {
              router.push('/login');
            }}
          >
            Getting started
          </button>
        </div>
      </div>
    </div> */
}
