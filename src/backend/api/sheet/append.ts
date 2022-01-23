import axios from "axios";
import { SHEET_URL } from './config';
import sheets from '../../src/sheets';

const appendSpreadSheetValue = async (accessToken: String,
    spreadSheetId: String,
    range: String | undefined,
    data: { amount: String, remark: String, type: String, symbol: String }
) => {
    try {
        let tempRange;
        if (!range) {
            const defaultRange = sheets.templateHelper.getRange();
            tempRange = `${defaultRange[0]}:${defaultRange[defaultRange.length - 1]}`
        } else {
            tempRange = range;
        }
        const url = `${SHEET_URL}/spreadsheets/${spreadSheetId}/values/${tempRange}:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&valueInputOption=USER_ENTERED`;
        const convertedData = sheets.templateHelper.appendValuesConvertData(data);
        const apiData = { values: [convertedData] }
        console.log(apiData)
        const response = await axios.post(url,apiData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    redirect: "follow"
                },
            });
        return response.data
     
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export {
    appendSpreadSheetValue
}