import {
  ClipboardCopyIcon,
  PlusIcon,
  SaveIcon,
} from '@heroicons/react/outline';
import useUser from '../../hooks/user';
import useSheet from '../../hooks/sheet';
import { useEffect, useRef, useState } from 'react';
import helper, { extractSheet } from '../../helper';
import * as yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const Create = () => {
  const [user] = useUser();
  const [,setSheet] = useSheet();
  const spreadSheetLink = useRef('');
  const name = useRef('');
  const [isCreating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  const setSpreadSheetLink = async () => {
    setCreating(true);
    const schema = yup.object().shape({
      url: yup.string().url().required('Sheet Link should be url')
        .test('is-valid', 'Not a valid sheet url', (value: any) => {
          try {
            extractSheet(value);
            return true
          } catch (error) {
            return false;
          }
        }),
      name: yup.string().default('YourSheet'),
    })
    try {
      const validData = await schema.validate({ url: spreadSheetLink.current, name: name.current }, {
        abortEarly: false
      });
      await axios.post('/api/v1/sheets/settings', {
        sheetLink: validData.url,
        sheetId: extractSheet(validData.url),
        name: validData.name,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api_key': user.API_KEY,
          'x-api_secret': user.API_SECRET
        }
      })
      setSheet({
        sheetId: extractSheet(validData.url),
        sheetUrl: validData.url,
        name: validData.name
      });
    } catch (error: any) {
      if (error.errors) {
        error.errors && error.errors.forEach((err: any) => {
          toast.error(err);
        })
      } else {
        toast.error(error.message);
      }
    }
    setCreating(false);
  };
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000)
    }
  }, [copied])
  return (
    <div className="mt-4 divide-y divide-gray-200 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col">
        <div className="mt-10">
          <label htmlFor="email" className="font-bold text-xl">
            1. Copy the email
          </label>
          <div className="mt-1 relative">
            <input
              className="appearance-none block w-full bg-white text-black border border-gray-500 rounded-md py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white dark:text-black"
              id="email"
              type="email"
              name="email"
              disabled
              value={helper.getFirebaseConfig().CLIENT_EMAIL}
              placeholder="Remarks (If any)"
            />
            <button
              onClick={() => {
                setCopied(true);
                navigator.clipboard.writeText(helper.getFirebaseConfig().CLIENT_EMAIL);
              }}
              className="px-4 bg-slate-800 dark:bg-slate-700 hover:bg-opacity-90 dark:hover:bg-opacity-90 text-white absolute inset-y-0 right-0 rounded-r-md inline-flex items-center justify-center space-x-2">
              <ClipboardCopyIcon className="h-5 w-5" />
              <span>{copied ? 'Copied to clipboard' : 'Copy mail address'}</span>
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
            className="my-2 py-2 px-4 inline-flex items-center space-x-1 rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:text-black"
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
              className="p-2 border rounded border-black w-full dark:text-black "
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
              className="p-2 w-full border rounded border-black dark:text-black  "
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
