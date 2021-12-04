import { NextPage } from "next";
import { TimeLine } from '../../components';
import { useEffect } from "react";
import setStore, { useStore } from '../../store';
import axios from "axios";
import { useRouter } from "next/router";
const History: NextPage = () => {
    const { userDetails = {}, accessToken, sheetId } = useStore();
    const router = useRouter()
    useEffect(() => {
        console.log(accessToken, sheetId);
        const fetchData = async () => {
            try {
                const response = await axios.post('/api/sheets/get', {
                    accessToken, sheetId
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (!accessToken) {
            router.push('/login')
        }

    }, [])
    return (
        <div>
            <TimeLine />
        </div>
    )
}

export default History