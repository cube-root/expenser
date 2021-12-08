import helper from '../index'

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
                    dataType: columnTemplate[columnLabel].type
                }
            }
        });
        return mapResult;
    })
    return result;
}

export {
    convertValue
}