
import {
    verifyKey,
    verifySecret
} from '../helper/token';
import Firebase from '../helper/firebase';

type inputProps = {
    API_KEY: string | any,
    API_SECRET: string | any,
    data?: any
}
const settings = {
    get: async ({
        API_KEY,
        API_SECRET
    }: inputProps) => {
        const tokenData: any = await verifyKey(API_KEY);
        await verifySecret(API_SECRET, tokenData.uid);
        const firebase = new Firebase();
        const sheetData = await firebase.getSheetData(tokenData.uid);
        return {
            currentSheet: sheetData.spreadSheetId,
            currentSheetLink: sheetData.spreadSheetLink,
            usedSheets: sheetData.sheets || [],
            name: sheetData.name || ''
        }
    },
    getGeneralSettings: async ({
        API_KEY,
        API_SECRET
    }: inputProps) => {
        const tokenData: any = await verifyKey(API_KEY);
        await verifySecret(API_SECRET, tokenData.uid);
        const firebase = new Firebase();
        let result = {}
        try {
            const data = await firebase.getGeneralSettings(tokenData.uid);
            result = data;
        } catch (error) {
            // set default settings
            await firebase.setGeneralSettings(tokenData.uid, {
                types: ["food", "travel", "other"],
                defaultCurrency: '$'
            })
            result = {
                types: ["food", "travel", "other"],
                defaultCurrency: '$'
            }
        }
        return result;
    },
    setGeneralSettings: async ({
        API_KEY,
        API_SECRET,
        data
    }: inputProps) => {
        if (!data) {
            throw new Error('Invalid data');
        }
        const tokenData: any = await verifyKey(API_KEY);
        await verifySecret(API_SECRET, tokenData.uid);
        const firebase = new Firebase();
        await firebase.setGeneralSettings(tokenData.uid, data);
    },
}

export default settings;