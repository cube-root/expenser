import { useEffect, useState } from 'react';
import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';
import { firestoreSheetCollectionTag, firebaseTag, firestoreUserCollectionTag } from '../config/tag';

const GetStorageData = (firebaseConfig:any) => {
  const [data, setData] = useState<any>({});
  const [isLoading, setLoading] = useState(false);
  let app;
  app = firebase.initializeApp(firebaseConfig, 'firebaseTagx');
  try {

    const firebaseApps = firebase.getApp(firebaseTag);
    app = firebaseApps;
  } catch (error) {
    app = firebase.initializeApp({...firebaseConfig,projectId: process.env.PROJECT_ID}, firebaseTag);
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
      const userId = window.sessionStorage.getItem('uid') || '';
      storageData['accessToken'] = window.sessionStorage.getItem('accessToken');
      storageData['uid'] = userId;
      if (!window.sessionStorage.getItem("sheetId")) {
        const sheetDockRef = firestore.doc(db, firestoreSheetCollectionTag, userId);
        const sheetDocSnapShot = await firestore.getDoc(sheetDockRef);
        if (sheetDocSnapShot.exists()) {
          storageData['sheet'] = sheetDocSnapShot.data();
          storageData['sheetId'] = sheetDocSnapShot.data().spreadSheetId;
          storageData['sheetLink'] = sheetDocSnapShot.data().spreadSheetLink;
          window.sessionStorage.setItem('sheetId', sheetDocSnapShot.data().spreadSheetId);
          window.sessionStorage.setItem('sheetLink', sheetDocSnapShot.data().spreadSheetLink);
        }
      } else {
        storageData['sheetId'] = window.sessionStorage.getItem("sheetId");
        storageData['sheetLink'] = window.sessionStorage.getItem("sheetLink");
        storageData['sheet'] = {
          spreadSheetId: window.sessionStorage.getItem("sheetId"),
          spreadSheetLink: window.sessionStorage.getItem("sheetLink"),
        }
      }
      if (window.sessionStorage.getItem("isUserSet") !== 'true') {
        const userDocRef = firestore.doc(db, firestoreUserCollectionTag, userId);
        const userDocSnapShot = await firestore.getDoc(userDocRef);
        if (userDocSnapShot.exists()) {
          storageData['user'] = userDocSnapShot.data();
          storageData['photoUrl'] = userDocSnapShot.data().photoUrl;
          storageData['displayName'] = userDocSnapShot.data().displayName;
          window.sessionStorage.setItem('photoUrl', userDocSnapShot.data().photoUrl);
          window.sessionStorage.setItem('displayName', userDocSnapShot.data().displayName);
          window.sessionStorage.setItem('isUserSet', 'true');
        }
      } else {
        storageData['photoUrl'] = window.sessionStorage.getItem("photoUrl");
        storageData['displayName'] = window.sessionStorage.getItem("displayName");
      }
      setData(storageData);
      setLoading(false);
    })()
  }, []);
  return { isLoading, data };
};

export default GetStorageData;
