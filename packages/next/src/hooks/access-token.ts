const UseAccessToken = (): any => {
    const setToken = (result: any) => {
        if (window && result) {
            const { token, uid, idToken } = result;
            window
                .localStorage
                .setItem('uid',
                    typeof token === 'string'
                        ? uid
                        : `${uid}`
                );
            window.localStorage.setItem('idToken', idToken);
            window
                .localStorage
                .setItem('accessToken',
                    typeof token === 'string'
                        ? token
                        : `${token}`
                );
        }
    }
    const getAccessToken = () => {
        return window ? window.localStorage.getItem('accessToken') : undefined;
    }
    return [getAccessToken, setToken];
};

export default UseAccessToken;
