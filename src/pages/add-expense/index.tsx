import { NextPage } from 'next'
const AddExpense: NextPage = () => {

    return (<div className="grid place-items-center mt-10">
        <form className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Amount
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                </div>


            </div>
            <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Remark
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                </div>


            </div>
            <div className="flex flex-wrap -mx-3 mb-3 justify-center items-center">
                <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
                        Type
                    </label>
                    <div className="relative">
                        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                            <option>Food</option>
                            <option>Travel</option>
                            <option>Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Button
                </button>
            </div>
        </form>
    </div>)
}

export default AddExpense;