import templateJSON from '../../config/template.json';
type sheetData = {
    amount: string;
    remark: string;
    type: string;
    symbol: string
}

class Template {
    template: Record<string, Record<string, unknown>>
    size: number
    indexList: Array<string>
    lastIndex: string
    firstIndex: string
    constructor() {
        this.template = templateJSON;
        this.size = Object.keys(this.template).length;
        this.indexList = Object.keys(this.template);
        this.lastIndex = this.indexList[this.size - 1];
        this.firstIndex = this.indexList[0];
    }
    /**
     * 
     * @param value Array<any>
     * @returns Array<any> [{data:{{amount:{value:xxx,dataType: int,name:Amount}}},meta:{range:xxx,rowId:xxx}},...]
     * Example response
     * {
            range: 'Sheet1!A1:F1008',
            majorDimension: 'ROWS',
            values: [
              [ '1651082819824', '4/27/2022', '100', '$', 'food', 'test' ],
              [ '1651082819824', '4/27/2022', '100', '$', 'food', 'test' ],
              [ '1651088070297', '4/28/2022', '250', '$', 'food', 'test' ]
            ]
        }
     */
    converter = (value: Array<any>) => {
        return value.map((item:Array<string>)=>{
            const data:any = {};
            const meta:any = {};
            item.forEach((element:string,index:number)=>{
                const templateColumn:{
                    id:string,
                    type:string,
                    name:string
                    inputMeta: any,
                    options?: Array<any>
                    isNullable?: boolean
                } | any = this.template[this.indexList[index]]
                data[templateColumn.id] = {
                    value: element,
                    dataType: templateColumn.type,
                    name: templateColumn.name,
                }

            })
            return {
                data,
                meta
            }

        })
    }
    sheetDataConverter = (inputValue: sheetData | any)=>{
        return this.indexList.map((columnName:string)=>{
            const id = this.template[columnName].id as string;
            if (id === 'id') {
              return `${new Date().getTime()}`;
            } else if (id === 'date') {
              // MM/DD/YYYY
              return `${new Date().toLocaleDateString()}`;
            } else {
              return inputValue[id] ? inputValue[id] : null;
            }
        })
    }
}

export default Template;