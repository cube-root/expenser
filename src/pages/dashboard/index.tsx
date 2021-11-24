import { useStore } from '../../store'
const Dashboard = () => {
    const { userDetails } = useStore();
    console.log(userDetails);
    return <div>
        Dashboard
        <pre>
            {JSON.stringify(userDetails, null, 2)}
        </pre>
    </div>
}

export default Dashboard;