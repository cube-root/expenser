import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../../store';
import Navigation from '../../components/navigation';
import { ListFirebaseProjects } from '../../components';
const Dashboard = () => {
    const { userDetails = {}, accessToken,firebaseProjectId } = useStore();
    const router = useRouter()
    const { email, displayName, photoURL } = userDetails
    useEffect(() => {
        if (!firebaseProjectId || !accessToken) {
            router.push('/login')
        }
    }, [firebaseProjectId])
    return <div>
        <Navigation />
        <ListFirebaseProjects />
        {firebaseProjectId}
        {/* <pre>
            {JSON.stringify(userDetails, null, 2)}
        </pre> */}
    </div>
}

export default Dashboard;