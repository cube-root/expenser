import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Mode from '../components/mode';
import useMode from '../hooks/mode';
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function MyApp({ Component, pageProps }: AppProps) {
  const {
    darkMode,
    toggleMode: setDarkMode
  } = useMode();

  return (
    <main
      className={classNames(darkMode ? 'dark' : '', 'font-dmSans relative')}>
      <Component {...pageProps} darkMode={darkMode} />
      <ToastContainer />
      <div className='absolute top-0 right-0 dark:text-white z-50'>
        <Mode darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </main>
  );
}

export default MyApp;
