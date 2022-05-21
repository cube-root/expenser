import { useState, useEffect } from "react"
import axios from "axios";
import GetStorageData from '../../hooks/get-data'
import helper from "../../helper";
const General = () => {
    const [isLoading, setLoading] = useState(false);
    const [currency, setCurrency] = useState<string>('$');
    const { data: storage } = GetStorageData(helper.getFirebaseConfig());
    const changeCurrency = async () => {
        try {
            if (currency !== undefined) {
                setLoading(true)
                const response = await axios.post("api/v1/settings/general", {
                    defaultCurrency: currency
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api_key': storage.API_KEY,
                        'x-api_secret': storage.API_SECRET,
                    }
                })
                console.log(response.data)
                setLoading(false)
            }

        } catch (error) {
            // do nothing
        }

    }
    useEffect(() => {
        setLoading(true);
        (async () => {
            try {
                const response = await axios.get("api/v1/settings/general", {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api_key': storage.API_KEY,
                        'x-api_secret': storage.API_SECRET,
                    }
                })
                if (response.data && response.data.defaultCurrency)
                    setCurrency(response.data.defaultCurrency)
            } catch (error) {
                // do nothing
            }
            setLoading(false);
        })();
    }, [storage.API_KEY, storage.API_SECRET])
    if (isLoading) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Default Currency
                </label>
                <div className="flex flex-row">
                    <input value={currency} onChange={e => setCurrency(e.target.value)} className='border border-black p-2' />
                    <div className="ml-2">
                        <button className="border p-2" onClick={changeCurrency} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )


}


export default General