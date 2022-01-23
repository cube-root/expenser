import { NextPage, } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import axios from 'axios';
const AddExpense: NextPage = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const amount = useRef<any>(0);
    const remark = useRef<string>('');
    const type = useRef<string>('food');
    const currency = useRef<string>('$');
    const fetchData = async (
        { accessToken, sheetId,inputData }
            : { accessToken: any, sheetId: string, inputData: any }
    ) => {
        setLoading(true)
        try {
            const response = await axios.post('/api/sheets/append', {
                accessToken: accessToken
                , sheetId: sheetId,
                data: inputData
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (response.data.status) {
                // setData(response.data.data)
                console.log(response.data.data)
            } else {
                // TODO error
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }
    const formSubmit = async (event: any) => {
        event.preventDefault();
        if (global) {
            setLoading(true)
            const sheetId = global.window.localStorage.getItem('spreadSheetId');
            const accessToken = global.window.sessionStorage.getItem('accessToken');

            if (sheetId === null || !sheetId) {
                router.push('/home');
                return false;
            }
            console.log({
                amount: amount.current,
                remark: remark.current,
                type: type.current,
                symbol: currency.current
            });
            await fetchData({
                accessToken, sheetId, inputData: {
                    amount: amount.current,
                    remark: remark.current,
                    type: type.current,
                    symbol: currency.current
                }
            })
            setLoading(false);
        }

    }

    return (
        <div className="grid place-items-center mt-10 ">
            <form className="w-full max-w-lg " onSubmit={formSubmit}>
                <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                    <div className="md:w-1/2 px-3 mb-3 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Amount
                        </label>
                        <input
                            required
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name" type="number"
                            name="amount"
                            step="any"
                            onChange={(event) => { amount.current = event.target.value }}
                            placeholder="Amount" />
                    </div>


                </div>
                <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                    <div className="md:w-1/2 px-3 mb-3 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Remark
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-first-name"
                            type="text"
                            name="remark"
                            placeholder="Remark"
                            onChange={(event) => { remark.current = event.target.value }}
                        />
                    </div>


                </div>
                <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                    <div className=" md:w-1/2 px-3 mb-3 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                            Type
                        </label>
                        <div className="relative">
                            <select
                                required
                                name='type'
                                onChange={(event) => { type.current = event.target.value }}
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                <option selected value="food">Food</option>
                                <option value="travel">Travel</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                    <div className=" md:w-1/2 px-3 mb-3 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                            Currency
                        </label>
                        <div className="relative">
                            <select
                                required
                                name='currency'
                                onChange={(event) => { currency.current = event.target.value }}
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                <option value="₹">₹</option>
                                <option selected value="$">$</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                        {isLoading ? 'Loading...' : 'Add Expense'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddExpense;