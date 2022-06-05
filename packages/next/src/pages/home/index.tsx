import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import GetStorageData from '../../hooks/get-data';
import ErrorCard from '../../components/error-card';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import helper from '../../helper';
import {
  ChevronRightIcon,
  ClipboardListIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';

function CompleteCard() {
  const router = useRouter();
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm   text-green-800">Configure completed</h3>
          <div className="mt-2 text-sm text-green-700">
            <p className=" ">Add and view expense from the navigation tab !!</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex pt-5">
              <button
                type="button"
                className="border  border-black    bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                onClick={() => {
                  router.push('/add-expense');
                }}>
                Add Expense
              </button>
              <button
                type="button"
                className="border  border-black   ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                onClick={() => {
                  router.push('/get-expense');
                }}>
                View Expense
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const router = useRouter();
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
          router.push('/integrations');
        }}>
        <span className="text-base">Add telegram integration</span>
      </button>
    </div>
  );
};

const Home = () => {
  const [data, setData] = useState<any>([]);
  const storage = GetStorageData(helper.getFirebaseConfig());
  const { isLoading, data: storageData } = storage;
  useEffect(() => {
    const newData: any = [];
    if (
      storageData &&
      (!storageData.sheet || !storageData.sheet.spreadSheetId)
    ) {
      newData.push('Problem with Spreadsheet ID. Please configure sheet !!!.');
    }
    setData(newData);
  }, [storageData]);
  const router = useRouter();

  return (
    <SideBar>
      <>
        {isLoading && (
          <div className="flex justify-center">
            <div>Loading...</div>
          </div>
        )}
        {!isLoading && (
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
                  <span className="text-lg flex-auto text-left">
                    View Expenses
                  </span>
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
        )}
      </>
    </SideBar>
  );
};

export default Home;
