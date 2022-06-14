import { useRef, useState } from 'react';
import { extractSheet } from '../../helper';
import useUser from '../../hooks/user';
import useSheet from '../../hooks/sheet';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import axios from 'axios';
import {
  SaveIcon,
} from '@heroicons/react/outline';

const Update = () => {
  const [isCreating, setCreating] = useState(false);
  const [user] = useUser();
  const [, setSheet] = useSheet();

  const spreadSheetLink = useRef('');
  const name = useRef('');

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
      toast.info('Sheet updated')
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
  return (
    <div className="mt-10 divide-y divide-gray-200">
      <div className="flex flex-col">
        <div className="mt-2">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Paste sheet link here
          </label>
          <input
            className="p-2 border rounded border-gray-800 w-full"
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
            Choose a name
          </label>
          <input
            className="p-2 w-full border rounded border-gray-800"
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
            <span>{isCreating ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update;
