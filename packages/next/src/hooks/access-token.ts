const UseAccessToken = (): any => {
    const setToken = (result: any) => {
        if (window && result) {
            const { token, uid, idToken } = result;
            window
                .sessionStorage
                .setItem('uid',
                    typeof token === 'string'
                        ? uid
                        : `${uid}`
                );
            window.sessionStorage.setItem('idToken', idToken);
            window
                .sessionStorage
                .setItem('accessToken',
                    typeof token === 'string'
                        ? token
                        : `${token}`
                );
        }
    }
    const getAccessToken = () => {
        return window.sessionStorage.getItem('accessToken');
    }
    return [setToken, getAccessToken];
};

export default UseAccessToken;
