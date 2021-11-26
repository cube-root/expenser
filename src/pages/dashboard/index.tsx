import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../../store';
import Navigation from '../../components/navigation';
import { ListFirebaseProjects } from '../../components';
const Dashboard = () => {
    const { userDetails = {}, accessToken } = useStore();
    const router = useRouter()
    const { email, displayName, photoURL } = userDetails
    useEffect(() => {
        if (!accessToken) {
            router.push('/login')
        }
    }, [accessToken])
    return <div>
        <Navigation />
        <ListFirebaseProjects />
        {/* <pre>
            {JSON.stringify(userDetails, null, 2)}
        </pre> */}
    </div>
}

export default Dashboard;