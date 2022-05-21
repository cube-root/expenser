import { SHEET_URL } from './config'
import Template from '../helper/template';
import axios from 'axios';

const api = {
    get: async (accessToken: string,
        spreadSheetId?: string | string[],
        range?: string | undefined
    ) => {
        let tempRange = range;
        const template = new Template();
        if (!range) {
            tempRange = `${template.firstIndex}1:${template.lastIndex}`;
        }
        const response = await axios.get(
            `${SHEET_URL}/spreadsheets/${spreadSheetId}/values/${tempRange}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    redirect: 'follow',
                },
            },
        );
        const data = template.converter(response.data.values || [])
        return data;
    },
    post: async (accessToken: string,
        spreadSheetId: string | string[] | undefined,
        data: {
            amount: string;
            remark: string;
            type: string;
            symbol: string
        },
        range: string | undefined = undefined,

    ) => {
        let tempRange = range;
        const template = new Template();
        if (!range) {
            tempRange = `${template.firstIndex}1:${template.lastIndex}`;
        }
        const url = `${SHEET_URL}/spreadsheets/${spreadSheetId}/values/${tempRange}:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&valueInputOption=USER_ENTERED`;
        const convertedData = template.sheetDataConverter(data);
        const apiData = { values: [convertedData] };
        const response = await axios.post(url, apiData, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
                redirect: 'follow',
            },
        });
        return response.data;
    }

}

export default api;