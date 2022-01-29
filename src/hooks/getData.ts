import { useEffect, useState } from "react";

const GetStorageData = () => {
    const [data,setData] = useState<any>({})
    useEffect(() => {
        let storageData: any = {}
        const userId = window.sessionStorage.getItem('uid') || ''
        storageData['accessToken'] = window.sessionStorage.getItem('accessToken');
        storageData['uid'] = userId;
        storageData['photoUrl'] = window.sessionStorage.getItem('photoUrl');
        storageData['displayName'] = window.sessionStorage.getItem('displayName');
        const sheetData = JSON.parse(window.localStorage.getItem('spreadSheetData') || '{}')
        storageData = { ...storageData, ...sheetData[userId] };
        setData(storageData)
    },[])
    return data
}


export default GetStorageData;