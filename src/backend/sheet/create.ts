import axios from "axios";
import { SHEET_URL } from './config';

type Data = {
    spreadsheetId: String
}
const createSpreadSheet = async (accessToken: String, data: Data) => {
    try {
        const response = await axios.post(`${SHEET_URL}/spreadsheets`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                redirect: "follow"
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export {
    createSpreadSheet
}