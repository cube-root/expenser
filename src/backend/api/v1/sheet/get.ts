import { getAccessToken } from '../../../src/token';
import sheetHelper from '../../helper/sheet';
const { getSpreadSheetValue: getValue } = sheetHelper
const getSpreadSheetValue = async ({sheetId}:{sheetId: any}) => {
    const token = await getAccessToken();
    const data = await getValue(token,sheetId);
    return data;
}


export {
    getSpreadSheetValue
}