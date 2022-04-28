import axios from 'axios';
import { SHEET_URL } from './config';
import sheets from '../../../helper/sheets';

const getSpreadSheetValue = async (
  accessToken: string,
  spreadSheetId: string,
  range?: string | undefined,
) => {
  let tempRange;
  if (!range) {
    const defaultRange = sheets.templateHelper.getRange();
    tempRange = `${defaultRange[0]}1:${defaultRange[defaultRange.length - 1]}`;
  } else {
    tempRange = range;
  }
  const response = await axios.get(
    `${SHEET_URL}/spreadsheets/${spreadSheetId}/values/${tempRange}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        redirect: 'follow',
      },
    },
  );
  const { values = [] } = response.data;
  const result = sheets.templateHelper.convertValue(values);
  return result;
};

export { getSpreadSheetValue };
