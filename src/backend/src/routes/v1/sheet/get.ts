import { getAccessToken } from '../../../../helper/token';
import sheetHelper from '../../../api/sheet';
const { getSpreadSheetValue: getValue } = sheetHelper
const getSpreadSheetValue = async ({sheetId}:{sheetId: any}) => {
    const token = await getAccessToken();
    const data = await getValue(token,sheetId);
    return data;
}


export {
    getSpreadSheetValue
}