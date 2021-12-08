const columnTemplate:Object= {
    'A': {
        id: 'id',
        name: 'Id',
        type: 'int'
    },
    'B': {
        id: 'date',
        name: 'Date',
        type: 'datetime'
    },
    'C': {
        id: 'amount',
        name: 'Amount',
        type: 'float'
    },
    'D': {
        id: 'symbol',
        name: 'Symbol',
        type: 'string'
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
        ]
    },
    'F': {
        id: 'remark',
        name: 'Remark',
        isNullable: true,
        type: 'string'
    }

}
export {
    columnTemplate
}