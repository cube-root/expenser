import helper from './helper';
const columnTemplate: Object = {
    'A': {
        id: 'id',
        name: 'Id',
        type: 'int',
        inputMeta: {
            field: 'number'
        }
    },
    'B': {
        id: 'date',
        name: 'Date',
        type: 'datetime',
        inputMeta: {
            field: 'date'
        }
    },
    'C': {
        id: 'amount',
        name: 'Amount',
        type: 'float',
        inputMeta: {
            field: 'number'
        }
    },
    'D': {
        id: 'symbol',
        name: 'Symbol',
        type: 'string',
        inputMeta: {
            field: 'select',
            getOptions: async () => {
                // {Label:Value}
                return helper.currencySymbol
            }
        }
    },
    'E': {
        id: 'type',
        name: 'Type',
        type: 'string',
        options: [
            {
                value: 'food',
                label: 'Food'
            },
            {
                value: 'travel',
                label: 'Travel'
            },
            {
                value: 'others',
                label: 'Others'
            }
        ],
        inputMeta: {
            field: 'select',
            getOptions: async () => {
                // {Label:Value}
                return {
                    Food: 'food',
                    Travel: 'travel',
                    Others: 'others'
                }
            }
        }
    },
    'F': {
        id: 'remark',
        name: 'Remark',
        isNullable: true,
        type: 'string',
        inputMeta:{
            field:'text-area',
            isNullable:true
        }
    }

}
// to map the numbers to the column label
const mapNumberToColumnLabel = (): any => {
    const result: any = {
        columnLength: 0,
        value: {}
    }
    Object.keys(columnTemplate).map((item, index) => {
        result['columnLength'] = index
        result['value'][index] = item
    });

    return result
}
export {
    columnTemplate,
    mapNumberToColumnLabel
}