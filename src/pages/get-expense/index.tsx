import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import Cards from '../../components/card';
import moment from 'moment';
import Header from '../../components/header';

const GetExpense = () => {
    const accessToken = useRef<any>(null);
    const [isLoading, setLoading] = useState(false);
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
            // const response = {
            //     status: true,
            //     data: exampleData
            // }
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
        const token = global.sessionStorage.getItem('accessToken')
        const sheetIdLocal = global.localStorage.getItem('spreadSheetId')
        if (global && token && sheetId) {
            accessToken.current = token
            sheetId.current = sheetIdLocal
            fetchData();
        } else {
            router.push('/login');
        }
    }, [])

    return (
        <div >
            <Header />
            <div className='flex flex-col my-10'>

                {isLoading && (<div>Loading.....</div>)}

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
        </div>)
}


export default GetExpense;