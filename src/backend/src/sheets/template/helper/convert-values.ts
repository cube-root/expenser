import helper from '../index'
import { columnTemplate } from '../template';

const convertValue = (values: Array<any>) => {
    const { columnLength, value: mapColumnValue } = helper.mapNumberToColumnLabel();
    const columnTemplate: any = helper.columnTemplate;
    const result = values.map((item) => {
        const mapResult: any = {

        }
        item.forEach((element: any, index: any) => {
            const columnLabel = mapColumnValue[index];
            if (columnLabel) {
                mapResult[columnTemplate[columnLabel].id] = {
                    value: element,
                    dataType: columnTemplate[columnLabel].type,
                    name: columnTemplate[columnLabel].name
                }
            }
        });
        return mapResult;
    })
    return result;
}

type inputValue = {
    amount: String,
    remark: String,
    type: String,
    symbol: String
}
const appendValuesConvertData = (inputValue: inputValue|any) => {
    const result = Object.keys(columnTemplate).map((columnName, index) => {
        const id = columnTemplate[columnName].id;
        if (id === 'id') {
            return `${new Date().getTime()}`;
        } else if (id === 'date') {
            return `${new Date()}`
        } else {
            return inputValue[id] ? inputValue[id] : null;
        }
    })
    return result;
}
export {
    convertValue,
    appendValuesConvertData
}