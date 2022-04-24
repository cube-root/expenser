const UseAccessToken = (): any => {
    const setToken = (result: any) => {
        if (window && result) {
            const {token,uid} = result;
            window
            .sessionStorage
            .setItem('uid',
                typeof token === 'string'
                    ? uid
                    : `${uid}`
            );
            window
                .sessionStorage
                .setItem('accessToken',
                    typeof token === 'string'
                        ? token
                        : `${token}`
                );
        }
    }
    return [setToken];
};

export default UseAccessToken;
