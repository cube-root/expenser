import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react';
import withUser from '../../wrapper/check-user';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { extractSheet } from '../../helper'
import axios from 'axios';
import useUser from '../../hooks/user';
import useSheet from '../../hooks/sheet';

const Connect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<any>('');
  const [name, setName] = useState<any>('');
  const [user] = useUser();
  const [, setSheet] = useSheet();
  const router = useRouter();

  const saveSettings = async () => {
    setIsLoading(true);
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
      const validData = await schema.validate({ url, name }, {
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
      router.push('/home');
    } catch (error: any) {
      if (error.errors) {
        error.errors && error.errors.forEach((err: any) => {
          toast.error(err);
        })
      } else {
        toast.error(error.message);
      }
    }
    setIsLoading(false)
  }
  return (
    <div className="bg-white h-screen w-full dark:bg-slate-900 relative">
      <div className="flex flex-col items-center px-4 justify-center space-y-4 text-slate-900 dark:text-slate-100 max-w-4xl mx-auto h-full">
        <div className="flex flex-col flex-auto justify-center w-full max-w-sm">
          <div className="pb-12 text-center">
            <Image
              src={'/images/onboarding-connect.png'}
              alt="logo"
              width={250}
              height={100}
              objectFit="contain"
            />
          </div>
          <h2 className="text-2xl mb-4 text-center">Copy & paste sheet link</h2>
          <div className="relative mx-auto w-full">
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Paste sheet link here
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="url"
                  id="url"
                  value={url}
                  onChange={(e: any) => setUrl(e.target.value)}
                  className="shadow-sm px-4 py-2 border focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-slate-300 rounded-md block dark:text-black"
                  placeholder="https://docs.google.com/spreadsheets/d/1jsmoasdns2jnsdl/edit#gid=0"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Give a name (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e: any) => setName(e.target.value)}
                  className="shadow-sm px-4 py-2 border focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-slate-300 rounded-md block dark:text-black"
                  placeholder="your sheet"
                />
              </div>
            </div>
          </div>
          <div className="mt-12 mx-auto">
            <button
              type="button"
              onClick={saveSettings}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border-2 border-slate-800 text-base font-medium rounded-full shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-white bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-0">

              {isLoading ? 'Saving...' : 'Save & Proceed'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withUser(Connect);
