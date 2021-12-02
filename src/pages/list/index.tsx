import { NextPage } from "next";
import { useStore } from '../../store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from "axios";

const ListPage: NextPage = () => {
    const { userDetails = {}, accessToken } = useStore();
    const router = useRouter();

    const createSheet = async () => {
        try {
            const response = await axios.post('/api/sheets/create', {
                accessToken
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(response.data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if(!accessToken){
            router.push('/login')
        }
    }, [accessToken])
    return <div>
        Hai
        <button onClick={createSheet}>
            createSheet
        </button>
    </div>
}

export default ListPage;