import { NextPage } from "next";
import { TimeLine } from '../../components';
import { useEffect, useState } from "react";
import setStore, { useStore } from '../../store';
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";
const History: NextPage = () => {
    const { userDetails = {}, accessToken, sheetId } = useStore();
    const [data,setData]= useState([])
    const [isLoading,setLoading] = useState(false);
    const [values, setValues] = useState([]);
    const router = useRouter();
    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await axios.post('/api/sheets/get', {
                    accessToken, sheetId
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                if(response.data.status){
                    setData(response.data.data)
                }else{
                    // TODO error
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false)
        }
        fetchData()
    }, [])
    // redirect to login 
    useEffect(() => {
        if (!accessToken) {
            router.push('/login')
        }
    }, [])
    // convert response 
    useEffect(() => {
       const timeLineValues:any = data.map((item:any) => {
            return {
                heading: moment(item?.date?.value).format('LL'),
                description: `${item?.amount?.value}  ${item?.symbol?.value}`,
                spanText: item?.type?.value,
                children: item?.remark?.value ? <span>Remark:{item?.remark?.value}</span> : null
            }
        })
        setValues(timeLineValues)
    }, [data])

    if(isLoading){
        return <div>Loading...</div>
    }

    return (
        <div>
            {data && <TimeLine values={values} />}
        </div>
    )
}

export default History