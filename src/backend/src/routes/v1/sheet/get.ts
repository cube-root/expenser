import { getAccessToken, verifyKey,verifySecret } from '../../../../helper/token';
import { getSpreadSheetValue as getValue } from '../../../api-helper/sheet';

const getSpreadSheetValue = async ({ sheetId }: { sheetId: any }, auth: { API_KEY: any, API_SECRET: any }) => {
    const tokenData: any = await verifyKey(auth.API_KEY);
    await verifySecret(auth.API_SECRET, tokenData.uid);
    const accessToken = await getAccessToken();
    const data = await getValue(accessToken, sheetId);
    return data;
}


export {
    getSpreadSheetValue
}