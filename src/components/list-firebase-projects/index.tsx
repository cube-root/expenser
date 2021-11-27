import { useStore } from '../../store';
import { useEffect } from 'react';
import axios from 'axios';
const ListFirebaseProjects = () => {

    const { accessToken, userDetails = {} } = useStore();
    const fetchData = async () => {
        try {
            const response = await axios.post('/api/firebase-list', { accessToken }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <div>
            List projects
            <pre>{JSON.stringify({  accessToken }, null, 2)}</pre>
        </div>)
}


export default ListFirebaseProjects;