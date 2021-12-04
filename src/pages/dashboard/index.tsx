import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../../store';
import Navigation from '../../components/navigation';

const Dashboard = () => {
    const { userDetails = {}, accessToken,sheetId } = useStore();
    const router = useRouter()
    const { email, displayName, photoURL } = userDetails
    useEffect(() => {
        console.log(sheetId)
        if (!accessToken)
            router.push('/login')
    }, [])
    return <div>
        <Navigation />
        {/* <pre>
            {JSON.stringify(userDetails, null, 2)}
        </pre> */}
    </div>
}

export default Dashboard;