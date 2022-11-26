import { useState } from 'react';
import SideBar from '../../components/sidebar';
// import ErrorCard from '../../components/error-card';
// import { CheckCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import withUser from '../../wrapper/check-user';
import withSidebar from '../../wrapper/sidebar';
import {
  ChevronRightIcon,
  ClipboardListIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';

const InitialCard = () => {
  const router = useRouter();
  return (
    <div className="rounded-md bg-green-600/20 px-4 py-6 text-center dark:text-white">
      <Image
        src="/images/currency symbols.png"
        alt="currencies"
        width={120}
        height={50}
        objectFit="contain"
      />
      <h3 className="text-lg mt-4 mb-6">Add an expense to get started</h3>
      <button
        className="rounded-full flex items-center space-x-2 bg-green-700 mx-auto text-white px-4 py-2"
        onClick={() => {
          router.push('/add-expense');
        }}>
        <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
        <span className="text-lg">Add an expense</span>
      </button>
    </div>
  );
};

const TelegramIntegration = () => {
  // const router = useRouter();
  return (
    <div className="rounded-md bg-blue-600/20 dark:text-white px-4 py-6">
      <div className="flex space-x-4 mb-4 sm:justify-center">
        <Image
          src="/images/telegram_logo.png"
          alt="currencies"
          width={120}
          height={50}
          objectFit="contain"
        />
        <h3 className="text-xl mt-4 mb-6">
          You can add expenses from telegram !!
        </h3>
      </div>
      <button
        className="rounded-full flex items-center space-x-2 bg-slate-900 w-full justify-center mx-auto sm:w-auto text-white px-4 py-2"
        onClick={() => {
          // router.push('/integrations');
          window.open('https://t.me/expenser_scheduler_bot', '_blank');
        }}>
        <span className="text-base">Open Telegram Bot</span>
      </button>
    </div>
  );
};
const Home = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col flex-auto">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InitialCard />
            <TelegramIntegration />
          </div>
          <button
            className="flex items-center justify-between w-full bg-green-600/20 dark:text-slate-50 p-4 space-x-4 text-slate-900 rounded-lg my-4"
            onClick={() => {
              router.push('/get-expense');
            }}>
            <ClipboardListIcon className="h-5 w-5" aria-hidden="true" />
            <span className="text-lg flex-auto text-left">View Expenses</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <div className="border-gray-200 rounded-lg">
                {data && data.length > 0 && (
                  <ErrorCard title="Error with configuration" list={data} />
                )}
                {(!data || data) && data.length === 0 && <CompleteCard />}
              </div>
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default withUser(withSidebar(Home));
