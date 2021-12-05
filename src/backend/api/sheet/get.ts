import axios from "axios";
import { SHEET_URL } from './config';
const getSpreadSheetValue = async (accessToken: String, spreadSheetId: String, range: String) => {
    try {
        const response = await axios.get(`${SHEET_URL}/spreadsheets/${spreadSheetId}/values/A:D`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
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
    getSpreadSheetValue
}