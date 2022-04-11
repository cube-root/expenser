import { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar';
import hooks from '../../hooks';
import ErrorCard from '../../components/error-card';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
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
          <h3 className="text-sm font-mono text-green-800">
            Configure completed
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p className="font-mono">
              Add and view expense from the navigation tab !!
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex pt-5">
              <button
                type="button"
                className="border  border-black  font-mono bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                onClick={() => {
                  router.push('/add-expense');
                }}
              >
                Add Expense
              </button>
              <button
                type="button"
                className="border  border-black font-mono ml-3 bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                onClick={() => {
                  router.push('/get-expense');
                }}
              >
                View Expense
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Home = () => {
  const [data, setData] = useState<any>([]);
  const storage = hooks.GetStorageData();
  useEffect(() => {
    if (Object.keys(storage).length > 0) {
      const data = [];
      if (!storage.accessToken || !storage.uid) {
        data.push('Problem with Access token. Please login again.');
      }
      if (!storage.spreadSheetId) {
        data.push('Problem with Spreadsheet ID. Please configure sheet !!!.');
      }
      setData(data);
    }
  }, [storage]);
  return (
    <>
      <SideBar />
      <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-mono text-black">Home</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <div className="border-gray-200 rounded-lg h-96">
                {data && data.length > 0 && (
                  <ErrorCard title="Error with configuration" list={data} />
                )}
                {(!data || data) && data.length === 0 && <CompleteCard />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
