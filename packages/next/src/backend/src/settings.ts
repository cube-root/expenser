
import {
    verifyKey,
    verifySecret
} from '../helper/token';
import Firebase from '../helper/firebase';

const settings = {
    get: async ({
        API_KEY,
        API_SECRET
    }: {
        API_KEY: string | string[],
        API_SECRET: string | string[]
    }) => {
        const tokenData: any = await verifyKey(API_KEY);
        await verifySecret(API_SECRET, tokenData.uid);
        const firebase = new Firebase();
        const sheetData = await firebase.getSheetData(tokenData.uid);
        return {
            currentSheet : sheetData.spreadSheetId,
            currentSheetLink: sheetData.spreadSheetLink,
            usedSheets: sheetData.sheets || [],
        }
    }
}

export default settings;