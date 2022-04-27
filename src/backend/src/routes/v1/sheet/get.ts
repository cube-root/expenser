import { getAccessToken } from '../../../../helper/token';
import { getSpreadSheetValue as getValue } from '../../../api/sheet';

const getSpreadSheetValue = async ({ sheetId }: { sheetId: any }) => {
    const token = await getAccessToken();
    const data = await getValue(token, sheetId);
    return data;
}


export {
    getSpreadSheetValue
}