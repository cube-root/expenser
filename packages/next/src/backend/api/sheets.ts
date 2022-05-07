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
        const data = template.converter(response.data.values)
        return data;
    }

}

export default api;