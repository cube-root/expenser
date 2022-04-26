type localStorageData = {
    accessToken: string,
    uid: string,
    photoUrl: string,
    displayName: string,
    sheetId?: string
}
const UseLocalStorage = (): any => {

    const set = (data: localStorageData) => {
        window.sessionStorage.setItem('accessToken', data.accessToken);
        window.sessionStorage.setItem('uid', data.uid);
        window.sessionStorage.setItem('photoUrl', data.photoUrl);
        window.sessionStorage.setItem('displayName', data.displayName);
        if (data.sheetId)
            window.sessionStorage.setItem('sheetId', data.sheetId);
    }
    const get = () => {
        console.log(process.env)
    }

    return [get, set];
};

export default UseLocalStorage;
