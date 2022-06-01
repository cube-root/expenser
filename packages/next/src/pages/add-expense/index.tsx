import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Forms from '../../components/forms';
import SideBar from '../../components/sidebar';
import getStorageData from '../../hooks/get-data';
import helper from '../../helper';
import { ChevronDownIcon } from '@heroicons/react/solid';

const AddExpense = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const { data: storage } = getStorageData(helper.getFirebaseConfig());
  const amount = useRef<any>(0);
  const remark = useRef<string>('');
  const type = useRef<string>('food');
  // const currency = useRef<string>('$');
  const fetchData = async ({
    sheetId,
    inputData,
  }: {
    sheetId: string;
    inputData: any;
  }) => {
    setLoading(true);
    try {
      await axios.post(
        `/api/v1/sheets/append?sheetId=${sheetId}`,
        {
          data: inputData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            API_KEY: storage.API_KEY,
            API_SECRET: storage.API_SECRET,
          },
        },
      );
      toast.success('Expense added successfully');
    } catch (error: any) {
      toast.error('Failed to add expense');
      if (error.message) toast.info(error.message);
    }
    setLoading(false);
  };
  const formSubmit = async (event: any) => {
    event.preventDefault();
    if (global) {
      setLoading(true);
      const sheetId =
        storage && storage.sheet ? storage.sheet.spreadSheetId : undefined;
      if (sheetId === null || !sheetId) {
        router.push('/home');
        return false;
      }
      //symbol: currency.current,
      await fetchData({
        sheetId,
        inputData: {
          amount: amount.current,
          remark: remark.current,
          type: type.current,
        },
      });
      setLoading(false);
    }
    event;
  };

  return (
    <SideBar>
      <form className="px-4 mt-8 max-w-xl mx-auto" onSubmit={formSubmit}>
        <h3 className="text-2xl leading-6 font-medium text-slate-900 dark:text-slate-50 text-center pb-4">
          Add an expense
        </h3>

        <div className="flex flex-col space-y-4 py-6">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Amount
            </label>
            <div className="mt-1 flex">
              <div className="relative">
                <Forms.CurrencyFormField
                  required
                  name="currency"
                  // onChange={(event: any) => {
                  //   currency.current = event.target.value;
                  // }}
                  className="appearance-none bg-gray-100 border border-gray-500 border-r-0 text-black py-3 px-4 pr-8 rounded-l-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="currency"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 -top-2 flex items-center px-2 text-gray-700">
                  <ChevronDownIcon className="fill-current h-5 w-5" />
                </div>
              </div>
              <Forms.AmountFormField
                required
                className="flex-auto appearance-none bg-white text-black border border-gray-500 rounded-r-md py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="amount"
                type="number"
                name="amount"
                step="any"
                onChange={(event: any) => {
                  amount.current = event.target.value;
                }}
                placeholder="Amount"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Category
            </label>
            <div className="mt-1 relative">
              <Forms.TypeFormField
                required
                name="type"
                onChange={(event: any) => {
                  type.current = event.target.value;
                }}
                className="block appearance-none w-full bg-white border border-gray-500 text-black py-3 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="category"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="fill-current h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="remark"
              className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Remark
            </label>
            <div className="mt-1">
              <input
                className="  appearance-none block w-full bg-white text-black border border-gray-500 rounded-md py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="remark"
                type="text"
                name="remark"
                placeholder="Remarks (If any)"
                onChange={event => {
                  remark.current = event.target.value;
                }}
              />
            </div>
          </div>

          {/* <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Currency
                  </label>
                  <div className="mt-1">
                    <Forms.CurrencyFormField
                      required
                      name="currency"
                      onChange={(event: any) => {
                        currency.current = event.target.value;
                      }}
                      className="  block appearance-none w-full bg-white border border-gray-500 text-vlack py-3 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-state"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div> */}
        </div>

        <div className="pt-6">
          <button
            disabled={isLoading}
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent shadow-sm text-lg  rounded-full text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            {isLoading ? 'Adding to your sheet...' : 'Add Expense'}
          </button>
          <p className="text-center text-slate-400 dark:text-slate-600 text-sm mt-2">
            Note: Your entry will be stored to your Google sheet.
          </p>
        </div>
      </form>
    </SideBar>
  );
};

export default AddExpense;
