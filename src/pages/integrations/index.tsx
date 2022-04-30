import { useEffect } from "react";
import { useState } from "react";
import useLocalStorage from "../../hooks/local-storage";
import axios from 'axios';
type typeResponse = {
    API_KEY: 'string',
    API_SECRET: 'string',
}
const Integrations = () => {
    const [userData, setData] = useState<any>({})
    const [isLoading,setLoading] = useState(false);
    const [responseData,setResponseData] = useState<typeResponse | undefined>(undefined);
    const [get] = useLocalStorage();
    const data = get();
    useEffect(() => {
        setData({
            idToken: data.idToken
        });
    }, [
        data
    ])
    const showKeys = async()=>{
        try {
            setLoading(true);
            console.log(userData.idToken)
            const response = await axios.post('/api/v1/integrations/keys',{},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.idToken}`
                }
            })
            setResponseData(response.data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    }
    if(isLoading){
        return (<div>Loading.....</div>)
    }
    return (
        <div>
            <div>
                <div>
                    <button
                    className="border rounded-lg p-2"
                        onClick={showKeys}
                    >Show Keys</button>
                </div>

            {responseData &&(
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