import { useEffect } from 'react'
import useUser from "../hooks/user";
import { useRouter } from 'next/router';

const withUser = (Component: any) => {
    const Wrapper = (props: any) => {
        const [user] = useUser();
        const router = useRouter();
        useEffect(() => {
            if (!user || !user.API_KEY || !user.API_SECRET) {
                router.push('/');
            }
        }, [])

        return <Component {...props} />
    }
    return Wrapper
}


export default withUser