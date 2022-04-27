import { getAccessToken } from '../../../../helper/token';
import { appendSpreadSheetValue as append } from '../../../api/sheet';

type data ={
    sheetId: string | any,
    data: any
}
const appendSpreadSheet = async ({ sheetId, data }: data ) => {
    const token = await getAccessToken();
    const result = await append(token, sheetId, undefined, data);
    return result;
}

export {
    appendSpreadSheet
}