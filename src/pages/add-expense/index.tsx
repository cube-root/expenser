import { NextPage, } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/header';
import Forms from '../../components/forms';
import SideBar from '../../components/sidebar';


const AddExpense: NextPage = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);

    const amount = useRef<any>(0);
    const remark = useRef<string>('');
    const type = useRef<string>('food');
    const currency = useRef<string>('$');
    const fetchData = async (
        { accessToken, sheetId, inputData }
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
                toast.success(("Expense added successfully"))
            } else {
                // TODO error

            }
        } catch (error) {
            console.log(error);
            toast.error(("Failed to add expense"))
            if (error.message)
                toast.info(error.message)
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
        <>
            <SideBar />
            <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto">
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl  text-gray-900 font-mono">Add Expense</h1>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

                        <div className="py-4 ">
                            <div className="border-4 bg-black border-dashed border-gray-200 rounded-lg h-auto pb-10" >
                                <div className="grid place-items-center mt-10 pt-10 ">
                                    <form className="w-full max-w-lg " onSubmit={formSubmit}>
                                        <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                                            <div className="md:w-1/2 px-3 mb-3 md:mb-0">
                                                <label className="block uppercase tracking-wide text-white text-xs font-mono mb-2">
                                                    Amount
                                                </label>
                                                <Forms.AmountFormField
                                                    required
                                                    className="font-mono appearance-none block w-full bg-white text-black border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    id="grid-first-name" type="number"
                                                    name="amount"
                                                    step="any"
                                                    onChange={(event: any) => { amount.current = event.target.value }}
                                                    placeholder="Amount"
                                                />
                                            </div>


                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                                            <div className="md:w-1/2 px-3 mb-3 md:mb-0">
                                                <label className="block  uppercase tracking-wide text-white text-xs font-mono mb-2">
                                                    Remark
                                                </label>
                                                <input
                                                    className="font-mono appearance-none block w-full bg-white text-black border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                                                <label className="block uppercase tracking-wide text-white text-xs font-mono mb-2" htmlFor="grid-state">
                                                    Type
                                                </label>
                                                <div className="relative">

                                                    <Forms.TypeFormField
                                                        required
                                                        name='type'
                                                        onChange={(event: any) => { type.current = event.target.value }}
                                                        className="font-mono block appearance-none w-full bg-white border border-white text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state"
                                                    />
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                                            <div className=" md:w-1/2 px-3 mb-3 md:mb-0">
                                                <label className="block uppercase tracking-wide text-white text-xs font-mono mb-2" htmlFor="grid-state">
                                                    Currency
                                                </label>
                                                <div className="relative">
                                                  
                                                    <Forms.CurrencyFormField
                                                        required
                                                        name='currency'
                                                        onChange={(event: any) => { currency.current = event.target.value }}
                                                        className="font-mono block appearance-none w-full bg-white border border-white text-vlack py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state"
                                                    />
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center items-center mt-5">
                                            <button
                                                disabled={isLoading}
                                                type="submit"
                                                className="border bg-white hover:bg-black text-black hover:text-white hover:border-white font-mono py-2 px-4 rounded-full"
                                            >
                                                {isLoading ? 'Loading...' : 'Add Expense'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </>
    )
}

export default AddExpense;