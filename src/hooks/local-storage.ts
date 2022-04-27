type localStorageData = {
    accessToken: string,
    uid: string,
    photoUrl: string,
    displayName: string,
    sheetId?: string,
    sheetLink?: string,
    API_KEY: string,
    API_SECRET: string,
}
const UseLocalStorage = (): any => {

    const set = (data: localStorageData) => {
        window.sessionStorage.setItem('accessToken', data.accessToken);
        window.sessionStorage.setItem('uid', data.uid);
        window.sessionStorage.setItem('photoUrl', data.photoUrl);
        window.sessionStorage.setItem('displayName', data.displayName);
        window.sessionStorage.setItem('isUserSet', 'true');
        window.sessionStorage.setItem('API_KEY', data.API_KEY);
        window.sessionStorage.setItem('API_SECRET', data.API_SECRET);
        if (data.sheetId)
            window.sessionStorage.setItem('sheetId', data.sheetId);
        if (data.sheetLink)
            window.sessionStorage.setItem('sheetLink', data.sheetLink);
    }
    const get = () => {
        const data: localStorageData = {
            accessToken: window.sessionStorage.getItem('accessToken') || '',
            uid: window.sessionStorage.getItem('uid') || '',
            photoUrl: window.sessionStorage.getItem('photoUrl') || '',
            displayName: window.sessionStorage.getItem('displayName') || '',
            sheetId: window.sessionStorage.getItem('sheetId') || undefined,
            sheetLink: window.sessionStorage.getItem('sheetLink') || undefined,
            API_KEY: window.sessionStorage.getItem('API_KEY') || '',
            API_SECRET: window.sessionStorage.getItem('API_SECRET') || '',
        }
        return data;
    }

    return [get, set];
};

export default UseLocalStorage;
