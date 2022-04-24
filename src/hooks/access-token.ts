const UseAccessToken = (): any => {
    const setToken = (token: any) => {
        if (window && token) {
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
