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
type BarChartReturnData = {
    labels: Array<any>,
    datasets: Array<{
        data: Array<number>
        backgroundColor: string,
        borderColor?: string,
    }>
}

const randColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

const doughnutChartDataConverter: DoughnutReturnData | any = (data: Array<Value>) => {
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
    // change to normal case
    labels = labels.map((str: string) => {
        if (str) {
            return str.split(" ").map(([firstChar, ...rest]: any) => firstChar.toUpperCase() + rest.join("").toLowerCase()).join(" ")
        }
        return undefined;
    }).filter((item: string) => item !== undefined)
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

const barChartDataConverter: BarChartReturnData | any = (data: Array<Value>, others?: any) => {
    const {
        addBorderColor = false
    } = others || {}
    let labels: any = []
    const totalAmount: any = {

    }
    data.map(item => {
        if (item.data.date.value) {
            const category: any = item.data.date.value.toUpperCase();
            const amount: any = parseFloat(item.data.amount.value);
            labels.push(category);
            totalAmount[category] = totalAmount[category] ? (totalAmount[category] + amount) : amount
            return {
                category,
                amount
            }
        } else {
            return undefined
        }
    });
    labels = Object.keys(totalAmount).filter((item, index) => index < 10);
    return {
        labels,
        datasets: [{
            data: labels.map((item: string) => totalAmount[item] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: addBorderColor ? 'rgba(255, 99, 132, 0.5)' : undefined
        }]
    }

}

const lineChartDataConverter: BarChartReturnData | any = (data: Array<Value>) => barChartDataConverter(data, {
    addBorderColor: true
})

export {
    doughnutChartDataConverter,
    barChartDataConverter,
    lineChartDataConverter
}