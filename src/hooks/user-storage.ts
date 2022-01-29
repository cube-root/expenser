import { useEffect, useState } from "react";

const Storage = (): any => {
    const [userData, setUserData] = useState<any>({});
    // useEffect(()=>{
    //     const { result = {} } = userData;
    //     const uidLocalStorage = window.localStorage.getItem('uid-localStorage');
    //     if(result.user.uid !== uidLocalStorage){
    //         // window.localStorage.clear();
    //     }
    // },[userData]);
    useEffect(() => {
        if (userData.global) {
            const { result = {} } = userData;
            userData.global.sessionStorage.setItem('accessToken', result._tokenResponse.oauthAccessToken)
            userData.global.sessionStorage.setItem('sign-in', JSON.stringify(result))
            userData.global.sessionStorage.setItem('uid', result.user.uid)
            userData.global.sessionStorage.setItem('photoUrl', result.user.photoURL)
            userData.global.sessionStorage.setItem('displayName', result.user.displayName)
            userData.global.localStorage.setItem('currentUser', result.user.uid)
        }
    }, [userData])
    
    return [userData.result, setUserData];
}


export default Storage