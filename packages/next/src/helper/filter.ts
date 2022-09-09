import moment from 'moment';

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
        remark: Data,
        paymentMode: Data
    },
    meta: any
}
/**
 * To sort the data array
 * @param data Array<Value>
 * @returns Sorted array of data
 */
const orderByDate = (data: Array<Value>): any => {
    return data.sort((a: Value, b: Value) => {
        return +new Date(b?.data?.date?.value) - +new Date(a?.data?.date?.value);
    }).filter(item => item !== undefined);
}
/**
 * To filter the array on a specific date
 * @param data Array<Value>
 * @param date String (MM/DD/YYYY)
 * @returns Array on specific date
 */
const getDataOnADate = (data: Array<Value>, date: string) => {
    return data.filter(item =>
        moment(item?.data?.date?.value, 'MM/DD/YYYY')
            .isSame(
                moment(date, 'MM/DD/YYYY')
                    .format('MM/DD/YYYY')
            )
    );
}
/**
 * 
 * @param data Array<Value>
 * @param startingDate date
 * @param endingDate date
 * @returns Filtered array on dates between starting and ending date
 *  order of the two arguments matter: the "smaller" date should be in the first argument
 */
const getDataOnDateBetween = (data: Array<Value>, startingDate: string, endingDate: string) => {
    return data.filter(item =>
        moment(item?.data?.date?.value, 'MM/DD/YYYY').isBetween(
            moment(startingDate, 'MM/DD/YYYY').format('MM/DD/YYYY'),
            moment(endingDate, 'MM/DD/YYYY').format('MM/DD/YYYY')
        )
    )
}
/**
 * 
 * @param data Array<Value>
 * @returns total amount
 */
const getTotalAmount = (data: Array<Value>) => {
    return data.reduce((previousValue: any, next: any) => {
        return previousValue + parseFloat(next?.data?.amount?.value);
    }, 0)
}

export {
    orderByDate,
    getDataOnADate,
    getDataOnDateBetween,
    getTotalAmount
}