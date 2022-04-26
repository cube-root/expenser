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
    app = firebase.initializeApp(firebaseConfig, firebaseTag);
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
      const sheetDockRef = firestore.doc(db, firestoreSheetCollectionTag, userId);
      const userDocRef = firestore.doc(db, firestoreUserCollectionTag, userId);

      const sheetDocSnapShot = await firestore.getDoc(sheetDockRef);
      const userDocSnapShot = await firestore.getDoc(userDocRef);
      if (sheetDocSnapShot.exists()) {
        storageData['sheet'] = sheetDocSnapShot.data();
      }
      if (userDocSnapShot.exists()) {
        storageData['user'] = userDocSnapShot.data();
      }
      setData(storageData);
      setLoading(false);
    })()
  }, []);
  return { isLoading, data };
};

export default GetStorageData;
