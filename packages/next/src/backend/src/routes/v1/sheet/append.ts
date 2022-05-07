import { getAccessToken, verifyKey, verifySecret } from '../../../../helper/token';
import { appendSpreadSheetValue as append } from '../../../api-helper/sheet';

type data = {
    sheetId: string | any,
    data: any
}
const appendSpreadSheet = async ({ sheetId, data }: data, auth: { API_KEY: any, API_SECRET: any }) => {
    const tokenData: any = await verifyKey(auth.API_KEY);
    await verifySecret(auth.API_SECRET, tokenData.uid);
    const token = await getAccessToken();
    const result = await append(token, sheetId, undefined, data);
    return result;
}

export {
    appendSpreadSheet
}