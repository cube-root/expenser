import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <main
      className={classNames(darkMode ? 'dark' : '', 'font-dmSans relative')}>
      <Component {...pageProps} darkMode={darkMode} />
      <ToastContainer />
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-0 right-0 dark:text-white">
        {darkMode ? 'Light' : 'Dark'}
      </button>
    </main>
  );
}

export default MyApp;
