
type Data = {
    value: string,
    dataType: string,
    name: string
}
type Value = {
    data: {
        id: Data,
        date: Data,
        amount: Data,
        symbol: Data,
        type: Data,
        remark: Data
    },
    meta: any
}
 const orderByDate = (data: Array<Value>): any => {
    return data.sort((a: Value, b: Value) => {
        return +new Date(b?.data?.date?.value) - +new Date(a?.data?.date?.value);
    }).filter(item => item !== undefined);
}
export {
    orderByDate
}