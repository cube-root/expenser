import helper from '../index';
import { columnTemplate } from '../template';

const convertValue = (values: Array<any>) => {
  const { columnLength, value: mapColumnValue } =
    helper.mapNumberToColumnLabel();

  const columnTemplate: any = helper.columnTemplate;
  const result = values.map((item, mainIndex) => {
    const mapResult: any = {};
    const meta: any = {};
    item.forEach((element: any, index: any) => {
      const columnLabel = mapColumnValue[index];
      if (columnLabel) {
        mapResult[columnTemplate[columnLabel].id] = {
          value: element,
          dataType: columnTemplate[columnLabel].type,
          name: columnTemplate[columnLabel].name,
        };
      }
    });
    meta['range'] = `${mapColumnValue[0]}${mainIndex + 1}:${
      mapColumnValue[columnLength]
    }`;
    meta['rowId'] = mainIndex + 1;
    return { data:mapResult, meta };
  });
  return result;
};

type inputValue = {
  amount: string;
  remark: string;
  type: string;
  symbol: string;
};
const appendValuesConvertData = (inputValue: inputValue | any) => {
  const result = Object.keys(columnTemplate).map(columnName => {
    const id = columnTemplate[columnName].id as string;
    if (id === 'id') {
      return `${new Date().getTime()}`;
    } else if (id === 'date') {
      // MM/DD/YYYY
      return `${new Date().toLocaleDateString()}`;
    } else {
      return inputValue[id] ? inputValue[id] : null;
    }
  });
  return result;
};
export { convertValue, appendValuesConvertData };
