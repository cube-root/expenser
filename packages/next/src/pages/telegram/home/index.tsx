import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HomeScreen from "../../../components/DefaultScreen";
import useUser from "../../../hooks/user";
import useSheet from "../../../hooks/sheet";

const Home = () => {
    const [, setUser] = useUser();
    const [, setSheet] = useSheet();
    const router = useRouter();
    const { query = {} } = router;
    const { token } = query;
    const checkSheetSettings = async ({ API_KEY, API_SECRET }: {
        API_KEY: string,
        API_SECRET: string
    }) => {
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
    }


    useEffect(() => {
        if (token) {
            ((async () => {
                try {
                    const response = await axios.post('/api/v1/user/data', {
                        accessToken: token
                    });
                    setUser({ ...response.data })
                    await checkSheetSettings({ ...response.data })
                } catch (error) {
                    router.push('/telegram/login')
                }
            })())
        }
    }, [token])
    return (
        <HomeScreen >
            <div>Loading .....</div>
        </HomeScreen>
    )
}

export default Home;