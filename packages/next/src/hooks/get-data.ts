/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';
import tag from '../config/tag.json';

const GetStorageData = (firebaseConfig:any) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setLoading] = useState(false);
  let app;

  try {

    const firebaseApps = firebase.getApp(tag.firebaseTag);
    app = firebaseApps;
  } catch (error) {
    app = firebase.initializeApp({...firebaseConfig,projectId: process.env.PROJECT_ID}, tag.firebaseTag);
  }
  const db = firestore.getFirestore(app);
  // const collection: any = firestore.collection(db, firestoreSheetCollectionTag);
  useEffect(() => {
    (async () => {
      if(Object.keys(data).length > 0){
        return;
      }
      setLoading(true);
      const storageData: any = {
        sheet: {},
      };
      const userId = window.localStorage.getItem('uid') || '';
      storageData['accessToken'] = window.localStorage.getItem('accessToken');
      storageData['uid'] = userId;
      if (!window.localStorage.getItem("sheetId")) {
        const sheetDockRef = firestore.doc(db, tag.sheetCollectionTag, userId);
        const sheetDocSnapShot = await firestore.getDoc(sheetDockRef);
        if (sheetDocSnapShot.exists()) {
          storageData['sheet'] = sheetDocSnapShot.data();
          storageData['sheetId'] = sheetDocSnapShot.data().spreadSheetId;
          storageData['sheetLink'] = sheetDocSnapShot.data().spreadSheetLink;
          window.localStorage.setItem('sheetId', sheetDocSnapShot.data().spreadSheetId);
          window.localStorage.setItem('sheetLink', sheetDocSnapShot.data().spreadSheetLink);
        }
      } else {
        storageData['sheetId'] = window.localStorage.getItem("sheetId");
        storageData['sheetLink'] = window.localStorage.getItem("sheetLink");
        storageData['sheet'] = {
          spreadSheetId: window.localStorage.getItem("sheetId"),
          spreadSheetLink: window.localStorage.getItem("sheetLink"),
        }
      }
      if (window.localStorage.getItem("isUserSet") !== 'true') {
        const userDocRef = firestore.doc(db, tag.userCollectionTag, userId);
        const userDocSnapShot = await firestore.getDoc(userDocRef);
        if (userDocSnapShot.exists()) {
          storageData['user'] = userDocSnapShot.data();
          storageData['photoUrl'] = userDocSnapShot.data().photoUrl;
          storageData['displayName'] = userDocSnapShot.data().displayName;
          window.localStorage.setItem('photoUrl', userDocSnapShot.data().photoUrl);
          window.localStorage.setItem('displayName', userDocSnapShot.data().displayName);
          window.localStorage.setItem('isUserSet', 'true');
          window.localStorage.setItem('API_KEY', userDocSnapShot.data().API_KEY);
          window.localStorage.setItem('API_SECRET', userDocSnapShot.data().API_SECRET);
        }
      } else {
        storageData['photoUrl'] = window.localStorage.getItem("photoUrl");
        storageData['displayName'] = window.localStorage.getItem("displayName");
        storageData['API_KEY'] = window.localStorage.getItem("API_KEY");
        storageData['API_SECRET'] = window.localStorage.getItem("API_SECRET");
      }
      setData(storageData);
      setLoading(false);
    })()
  }, []);
  return { isLoading, data };
};

export default GetStorageData;
