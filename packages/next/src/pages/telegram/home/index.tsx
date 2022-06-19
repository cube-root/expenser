import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useUser from "../../../hooks/user";
import useSheet from "../../../hooks/sheet";
const Home = () => {
    const [, setUser] = useUser();
    const [, setSheet] = useSheet();
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const { query = {} } = router;
    const { token } = query;
    const checkSheetSettings = async ({ API_KEY, API_SECRET }: {
        API_KEY: string,
        API_SECRET: string
    }) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/sheets/settings', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api_key': API_KEY,
                    'x-api_secret': API_SECRET
                }
            });
            const data = response.data;
            if (data && data.currentSheet) {
                setSheet({
                    sheetId: data.currentSheet,
                    sheetUrl: data.currentSheetLink,
                    name: data.name
                })
                router.push(`/home`);
            } else {
                router.push(`/onboarding`);
            }
        } catch (error) {
            router.push(`/onboarding`);
        }
        setLoading(false);
    }


    useEffect(() => {
        if (token) {
            setLoading(true);
            ((async () => {
                try {
                    const response = await axios.post('/api/v1/user/data', {
                        accessToken: token
                    });
                    setUser({ ...response.data })
                    await checkSheetSettings({ ...response.data })
                    setLoading(false);
                } catch (error) {
                    router.push('/telegram/login')
                }
            })())
        }
    }, [token])
    if (isLoading) {
        return <div>Loading...</div>
    }
    return null
}

export default Home;