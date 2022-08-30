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
type DoughnutReturnData = {
    labels: Array<any>,
    datasets: Array<{
        data: Array<number>
        backgroundColor: Array<number>,
        borderColor: Array<number>,
        borderWidth: number
    }>
}

const randColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

export const doughnutChartDataConverter: DoughnutReturnData | any = (data: Array<Value>) => {
    let labels: any = []
    const totalAmount: any = {

    }
    data.map(item => {
        if (item.data.type.value) {
            const category: any = item.data.type.value.toUpperCase();
            const amount: any = parseFloat(item.data.amount.value)
            labels.push(category);
            totalAmount[category] = totalAmount[category] ? (totalAmount[category] + amount) : amount
            return {
                category: item.data.type.value.toUpperCase(),
                amount: amount
            }
        } else {
            return undefined
        }

    })
    labels = new Set(labels);
    labels = [...labels];
    const dataset = labels.map((item: string) => {
        return totalAmount[item];
    })
    const color = labels.map(() => {
        return randColor();
    })
    return {
        labels: labels,
        datasets: [{
            data: dataset,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 2
        }]
    };
}