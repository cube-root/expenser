import axios from "axios";
import { SHEET_URL } from './config';
import sheets from '../../src/sheets';

const getSpreadSheetValue = async (accessToken: String, spreadSheetId: String, range: String | undefined) => {
    try {
        let tempRange;
        if (!range) {
            const defaultRange = sheets.templateHelper.getRange();
            tempRange = `${defaultRange[0]}2:${defaultRange[defaultRange.length - 1]}`
        } else {
            tempRange = range;
        }
        const response = await axios.get(`${SHEET_URL}/spreadsheets/${spreadSheetId}/values/${tempRange}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
                redirect: "follow"
            },
        });
        const { range: sheetRange, majorDimension, values = [] } = response.data;
        const result = sheets.templateHelper.convertValue(values);
        console.log(result);
        return result
    } catch (error) {
        throw error;
    }
}

export {
    getSpreadSheetValue
}