import { useState, useEffect } from 'react'

type LocalStorageData = {
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

const useLocalStorage = (): any => {
  const set = (data: LocalStorageData) => {
    if (!window) {
      return
    }

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

  const get = () => {
    const [data, setData] = useState({});
    useEffect(() => {
      setData(
        {
          accessToken: window.localStorage.getItem('accessToken') || '',
          uid: window.localStorage.getItem('uid') || '',
          photoUrl: window.localStorage.getItem('photoUrl') || '',
          displayName: window.localStorage.getItem('displayName') || '',
          sheetId: window.localStorage.getItem('sheetId') || undefined,
          sheetLink: window.localStorage.getItem('sheetLink') || undefined,
          API_KEY: window.localStorage.getItem('API_KEY') || '',
          API_SECRET: window.localStorage.getItem('API_SECRET') || '',
          idToken: window.localStorage.getItem('idToken') || ''
        }
      )
    }, [])
    return data;
  }

  return [get, set];
};

export default useLocalStorage;
