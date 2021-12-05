
import axios from "axios";
const FIREBASE_URL = 'https://firebase.googleapis.com/v1beta1';

const listProject = async (accessToken: String) => {
    try {
        const response = await axios.get(`${FIREBASE_URL}/projects`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                redirect: "follow"
            },
        })
        return response.data
    } catch (error) {
        throw error;
    }
}

export {
    listProject
}