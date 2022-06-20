import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import type { AppProps } from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import useMode from '../hooks/mode';
import Head from 'next/head';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function MyApp({ Component, pageProps }: AppProps) {
  const { darkMode, toggleMode: setDarkMode } = useMode();

  return (
    <main
      className={classNames(darkMode ? 'dark' : '', 'font-dmSans relative')}>
      <Head>
        <title>My Expense | Manage your expenses securely</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Store and Manage your expenses securely. Stop apps tracking your data. Your privacy matters"
        />
        <meta name="keywords" content="Expense, Money, Privacy, Secure" />
      </Head>
      <Component {...pageProps} darkMode={darkMode} />
      <ToastContainer />
    </main>
  );
}

export default MyApp;
