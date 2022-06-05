import {
  ClipboardCopyIcon,
  PlusIcon,
  SaveIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';
import { useRef, useState } from 'react';
import helper from '../../helper';
import SheetStorage from '../../hooks/sheet-storage';

const Create = ({
  setSpreadSheetLinkCallBack = () => undefined,
  firebaseConfig,
}: {
  setSpreadSheetLinkCallBack: any;
  firebaseConfig: any;
}) => {
  const spreadSheetLink = useRef('');
  const name = useRef('');
  const [isCreating, setCreating] = useState(false);
  const [, setStorageData] = SheetStorage();

  const setSpreadSheetLink = async () => {
    setCreating(true);
    if (spreadSheetLink.current.length !== 0) {
      await setStorageData({
        spreadSheetLink: spreadSheetLink.current,
        spreadSheetId: helper.extractSheet(spreadSheetLink.current),
        firebaseConfig,
        name: name.current,
      });
      setSpreadSheetLinkCallBack(
        helper.extractSheet(spreadSheetLink.current),
        spreadSheetLink.current,
      );
    }
    setCreating(false);
  };

  return (
    <div className="mt-4 divide-y divide-gray-200 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col">
        <div className="mt-10">
          <label htmlFor="email" className="font-bold text-xl">
            1. Copy the email
          </label>
          <div className="mt-1 relative">
            <input
              className="appearance-none block w-full bg-white text-black border border-gray-500 rounded-md py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="email"
              type="email"
              name="email"
              disabled
              value={process.env.CLIENT_EMAIL}
              placeholder="Remarks (If any)"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(process.env.CLIENT_EMAIL!);
              }}
              className="px-4 bg-slate-800 dark:bg-slate-700 hover:bg-opacity-90 dark:hover:bg-opacity-90 text-white absolute inset-y-0 right-0 rounded-r-md inline-flex items-center justify-center space-x-2">
              <ClipboardCopyIcon className="h-5 w-5" />
              <span>Copy mail address</span>
            </button>
          </div>
        </div>
        <div className="mt-5">
          <div className="font-bold text-xl">
            2.Create new sheet & share with email above
          </div>
          <a
            href="https://sheets.new"
            type="button"
            target={'_blank'}
            className="my-2 py-2 px-4 inline-flex items-center space-x-1 rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            rel="noreferrer">
            <PlusIcon className="w-4 h-4" />
            <span>Create New Sheet</span>
          </a>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            NOTE: Login Google drive with same email used to login.
          </div>
        </div>
        <div className="mt-8">
          <div className="font-bold text-xl">3.Paste the sheet id here</div>
          <div className="mt-2">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Paste sheet link here
            </label>
            <input
              className="p-2 border rounded border-black w-full   "
              type="text"
              placeholder="Paste Spread Sheet Link here"
              onChange={event => {
                spreadSheetLink.current = event.target.value;
              }}
            />
          </div>
          <div className="mt-2">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400">
              Choose a name (Optional)
            </label>
            <input
              className="p-2 w-full border rounded border-black   "
              type="text"
              placeholder="Please choose a name for sheet"
              onChange={event => {
                name.current = event.target.value;
              }}
            />
          </div>
          <div className="mt-4">
            <button
              disabled={isCreating}
              onClick={setSpreadSheetLink}
              className="inline-flex justify-center items-center space-x-2 px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-800 hover:bg-opacity-80 dark:hover:bg-opacity-80 text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <SaveIcon className="h-6 w-6" />
              <span>{isCreating ? 'Saving...' : 'Save New Sheet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
