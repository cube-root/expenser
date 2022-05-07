import {
    getAccessToken,
    verifyKey,
    verifySecret
} from '../helper/token';
import api from '../api';

class SheetService {
    sheetId?: string | string[];
    apiKey?: string | string[];
    apiSecret?: string | string[];

    constructor({ sheetId, API_KEY, API_SECRET }: {
        sheetId: string | string[],
        API_KEY: string | string[],
        API_SECRET: string| string[]
    }) {
        this.sheetId = sheetId;
        this.apiKey = API_KEY;
        this.apiSecret = API_SECRET;
    }
    // get spread sheet value
    async get() {
        const tokenData: any = await verifyKey(this.apiKey);
        await verifySecret(this.apiSecret, tokenData.uid);
        const accessToken = await getAccessToken();
        const value = await api.sheetsApi.get(accessToken, this.sheetId);
        return value;
    }
}


export default SheetService;