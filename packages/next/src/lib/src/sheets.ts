import {
    getAccessToken,
    verifyKey,
    verifySecret
} from '../helper/token';
import api from '../api';
import Firebase from '../helper/firebase';

class SheetService {
    sheetId?: string | string[];
    apiKey?: string | string[];
    apiSecret?: string | string[];

    constructor({ sheetId, API_KEY, API_SECRET }: {
        sheetId: string | string[],
        API_KEY: string | string[],
        API_SECRET: string | string[]
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
    // append to sheet
    async post(data: any) {
        const tokenData: any = await verifyKey(this.apiKey);
        await verifySecret(this.apiSecret, tokenData.uid);
        const firebase = new Firebase();
        let symbol = '$';
        try {
            const generaSettings = await firebase.getGeneralSettings(tokenData.uid);
            symbol = generaSettings.defaultCurrency
        } catch (error) {
            symbol = '$'
        }
        const accessToken = await getAccessToken();
        const response = await api.sheetsApi.post(accessToken, this.sheetId, {
            ...data,
            symbol: data.currency ? data.currency : symbol,
        });
        return response;
    }
    async changeSheet(sheetId: string, sheetLink: string, sheetName: string) {
        const tokenData: any = await verifyKey(this.apiKey);
        await verifySecret(this.apiSecret, tokenData.uid);
        const firebase = new Firebase()
        return firebase.setSheetData(tokenData.uid, {
            spreadSheetId: sheetId,
            spreadSheetLink: sheetLink,
            name: sheetName
        });
    }
    async deleteRow(data: { rowIndex: number }) {
        const { rowIndex } = data || {};
        if (!rowIndex) {
            throw new Error('invalid row-index');
        }
        const tokenData: any = await verifyKey(this.apiKey);
        await verifySecret(this.apiSecret, tokenData.uid);
        const accessToken = await getAccessToken();
        return api.sheetsApi.delete(accessToken, this.sheetId, {
            rowIndex
        })
    }
}


export default SheetService;