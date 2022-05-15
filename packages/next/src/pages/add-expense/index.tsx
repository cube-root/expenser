import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Forms from '../../components/forms';
import SideBar from '../../components/sidebar';
import GetStorageData from '../../hooks/get-data'
import helper from '../../helper';


const AddExpense = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const { data: storage } = GetStorageData(helper.getFirebaseConfig());
  const amount = useRef<any>(0);
  const remark = useRef<string>('');
  const type = useRef<string>('food');
  const currency = useRef<string>('$');
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
            'API_KEY': storage.API_KEY,
            'API_SECRET': storage.API_SECRET,
          },
        },
      );
      toast.success('Expense added successfully');
    } catch (error: any) {
      console.log(error);
      toast.error('Failed to add expense');
      if (error.message) toast.info(error.message);
    }
    setLoading(false);
  };
  const formSubmit = async (event: any) => {
    event.preventDefault();
    if (global) {
      setLoading(true);
      const sheetId = storage && storage.sheet ? storage.sheet.spreadSheetId : undefined;
      if (sheetId === null || !sheetId) {
        router.push('/home');
        return false;
      }
      await fetchData({
        sheetId,
        inputData: {
          amount: amount.current,
          remark: remark.current,
          type: type.current,
          symbol: currency.current,
        },
      });
      setLoading(false);
    }
    event
  };


  return (
    <>
      <SideBar>
        <form className="ml-10 mr-4 space-y-8 divide-y divide-gray-200 font-mono" onSubmit={formSubmit}>
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Add Expense</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your expense to sheet from here.
                </p>
              </div>
            </div>

            <div className="">
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="mt-1">

                    <Forms.AmountFormField
                      required
                      className="font-mono appearance-none block w-full bg-white text-black border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
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



                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Remark
                  </label>
                  <div className="mt-1">
                    <input
                      className="font-mono appearance-none block w-full bg-white text-black border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      name="remark"
                      placeholder="Remark"
                      onChange={event => {
                        remark.current = event.target.value;
                      }}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block font-mono text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <div className="mt-1">
                    <Forms.TypeFormField
                      required
                      name="type"
                      onChange={(event: any) => {
                        type.current = event.target.value;
                      }}
                      className="font-mono block appearance-none w-full bg-white border border-black text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                </div>
                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <div className="mt-1">
                    <Forms.CurrencyFormField
                      required
                      name="currency"
                      onChange={(event: any) => {
                        currency.current = event.target.value;
                      }}
                      className="font-mono block appearance-none w-full bg-white border border-black text-vlack py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex ">
              <button
                type="button"
                disabled={isLoading}
                className="font-mono bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="font-mono ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm  rounded-md text-white bg-cyan-700 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                {isLoading ? 'Loading...' : 'Add'}
              </button>
            </div>
          </div>
        </form>
      </SideBar>

    </>
  );
};


export default AddExpense;
