import { useEffect } from "react";
import { useState } from "react";
import useLocalStorage from "../../hooks/local-storage";
import axios from 'axios';
import SideBar from '../../components/sidebar';
import { toast } from 'react-toastify';
import useKeys from '../../hooks/keys';

type typeResponse = {
    API_KEY: 'string',
    API_SECRET: 'string',
}
const Integrations = () => {
    const [userData, setData] = useState<any>({})
    const [isLoading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState<typeResponse | undefined>(undefined);
    const [get] = useLocalStorage();
    const data = get();
    const [, setKeys] = useKeys();
    useEffect(() => {
        setData({
            idToken: data.idToken
        });
    }, [
        data
    ])
    const showKeys = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/v1/integrations/keys', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.idToken}`
                }
            })
            setResponseData(response.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to get keys');
            toast.info('Please login and try again');
            console.log(error);
        }
        setLoading(false)
    }
    const revokeKeys = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/v1/integrations/revoke-keys', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.idToken}`
                }
            })
            toast.success('Keys revoked successfully');
            setKeys({
                API_KEY: response.data.API_KEY,
                API_SECRET: response.data.API_SECRET
            })
            setResponseData(response.data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to revoke keys');
            toast.info('Please login and try again');
            console.log(error);
        }
        setLoading(false)
    }
    if (isLoading) {
        return (
            <div>
                <SideBar />
                <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto no-scrollbar mt-5">
                    Loading.....
                </div>
            </div>)
    }
    return (
        <div>
            <SideBar />
            <div className="md:pl-72 flex flex-col flex-1  h-screen overflow-y-auto no-scrollbar mt-5">
                <div className="flex flex-row gap-3 mt-10">
                    <div>
                        <button
                            disabled={isLoading}
                            className="border rounded-lg p-2"
                            onClick={showKeys}
                        >Show Keys</button>
                    </div>


                    <div>
                        <button
                            disabled={isLoading}
                            className="border rounded-lg p-2"
                            onClick={revokeKeys}
                        >Revoke Keys</button>
                    </div>
                </div>
                {responseData && (
                    <div className="flex flex-col">
                        <div>
                            API KEY : `{responseData.API_KEY}`
                        </div>
                        <div>
                            API SECRET : `{responseData.API_SECRET}`
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Integrations;