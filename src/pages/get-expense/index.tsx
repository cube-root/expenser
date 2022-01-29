import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import Cards from '../../components/card';
import moment from 'moment';
import SideBar from '../../components/sidebar';
import { RefreshIcon } from '@heroicons/react/solid'
import hooks from '../../hooks';
const GetExpense = () => {
    const accessToken = useRef<any>(null);
    const [isLoading, setLoading] = useState(false);
    const storage = hooks.GetStorageData()
    const [data, setData] = useState([]);
    const sheetId = useRef<any>(null);
    const router = useRouter();
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/sheets/get', {
                accessToken: accessToken.current, sheetId: sheetId.current
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if (response.status && response.data) {
                setData(response.data.data);
            }

        } catch (error) {

        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const token = storage.accessToken;
        const sheetIdLocal = storage.spreadSheetId;
        if (token && sheetId) {
            accessToken.current = token
            sheetId.current = sheetIdLocal
            fetchData();
        } else {
            // router.push('/login');
        }
    }, [storage])

    return (
        <div >
            <SideBar />
            <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto bg-gray-900 no-scrollbar">
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl  text-white font-mono">Sheet Settings</h1>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

                        <div className="py-4 ">
                            <div className="md:border-4 bg-black md:border-dashed md:border-gray-200 rounded-lg h-auto pb-10" >
                                <div className='flex flex-col my-10 items-center'>
                                    {isLoading && (
                                        <div
                                            className='flex flex-col items-center justify-center '>

                                            <div className='p-4'>
                                                <RefreshIcon className='animate-spin h-13 w-10' color='white' />
                                            </div>
                                            <p className='text-white font-mono'>
                                                Loading
                                                <span className='animate-pulse pl-1 pr-1'>
                                                    ...
                                                </span>
                                                Please wait
                                                <span className='animate-pulse pl-1'>
                                                    !!!
                                                </span>
                                            </p>
                                        </div>
                                        )}
                                    {(!isLoading && data) && (
                                        <div className='grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mx-3 pt-6'>
                                            {data.map((item: any, index) => {
                                                const {
                                                    mapResult,
                                                    meta
                                                } = item;
                                                return (
                                                    <Cards
                                                        meta={meta}
                                                        key={index}
                                                        heading={mapResult.type && mapResult.type.value ?
                                                            mapResult.type.value.toUpperCase()
                                                            : ' '
                                                        }
                                                        currency={mapResult.symbol && mapResult.symbol.value ? mapResult.symbol.value : ' '}
                                                        amount={mapResult.amount ? mapResult.amount.value : ' '}
                                                        date={mapResult.date ? moment(mapResult.date.value).format('LL') : ' '}
                                                        description={mapResult.remark ? mapResult.remark.value : ' '}
                                                    />
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>


        </div>)
}


export default GetExpense;