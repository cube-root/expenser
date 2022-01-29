import { useEffect, useState } from "react"

const SheetStorage = ()=>{
    const [data,setData] = useState<any>({})
    useEffect(()=>{
        const {
            spreadSheetId,
            spreadSheetLink
        } =data
        const currentUser = window.localStorage.getItem('currentUser');
        if(currentUser && spreadSheetId){
            const spreadSheetData = {
                [currentUser]:{
                    spreadSheetId,
                    spreadSheetLink
                }
            }
            window.localStorage.setItem('spreadSheetData',JSON.stringify(spreadSheetData))
        }
    },[data])
    return [data,setData]
}

export default SheetStorage