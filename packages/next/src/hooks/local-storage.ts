import { useState, useEffect } from 'react'
type localStorageData = {
    accessToken: string,
    uid: string,
    photoUrl: string,
    displayName: string,
    sheetId?: string,
    sheetLink?: string,
    API_KEY: string,
    API_SECRET: string,
    idToken: string
}
const UseLocalStorage = (): any => {

    const set = (data: localStorageData) => {
        if (window) {
            window.localStorage.setItem('accessToken', data.accessToken);
            window.localStorage.setItem('uid', data.uid);
            window.localStorage.setItem('photoUrl', data.photoUrl);
            window.localStorage.setItem('displayName', data.displayName);
            window.localStorage.setItem('isUserSet', 'true');
            window.localStorage.setItem('API_KEY', data.API_KEY);
            window.localStorage.setItem('API_SECRET', data.API_SECRET);
            if (data.sheetId)
                window.localStorage.setItem('sheetId', data.sheetId);
            if (data.sheetLink)
                window.localStorage.setItem('sheetLink', data.sheetLink);
        }

    }
    const Get = () => {
        const [data, setData] = useState({});
        useEffect(() => {
            setData({
                accessToken: window.localStorage.getItem('accessToken') || '',
                uid: window.localStorage.getItem('uid') || '',
                photoUrl: window.localStorage.getItem('photoUrl') || '',
                displayName: window.localStorage.getItem('displayName') || '',
                sheetId: window.localStorage.getItem('sheetId') || undefined,
                sheetLink: window.localStorage.getItem('sheetLink') || undefined,
                API_KEY: window.localStorage.getItem('API_KEY') || '',
                API_SECRET: window.localStorage.getItem('API_SECRET') || '',
                idToken: window.localStorage.getItem('idToken') || ''
            })
        }, [])
        return data;
    }

    return [Get, set];
};

export default UseLocalStorage;
