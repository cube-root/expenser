import { useStore } from '../../store'
const Dashboard = () => {
    const { userDetails = {} } = useStore();

    // const { email, displayName, photoURL } = userDetails
    return <div>
        Dashboard
        <pre>
            {JSON.stringify(userDetails, null, 2)}
        </pre>
    </div>
}

export default Dashboard;