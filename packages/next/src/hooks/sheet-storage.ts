import { useEffect, useState } from 'react';
import tag from '../config/tag.json';
import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';

const SheetStorage = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const updateData = async (data: any) => {
      const { spreadSheetId, spreadSheetLink, firebaseConfig } = data;
      let app;
      try {
        const firebaseApps = firebase.getApp(tag.firebaseTag);
        app = firebaseApps;
      } catch (error) {
        app = firebase.initializeApp({ ...firebaseConfig, projectId: process.env.PROJECT_ID }, tag.firebaseTag);
      }
      const db = firestore.getFirestore(app);
      // const collection: any = firestore.collection(db, firestoreSheetCollectionTag);
      const currentUser = window.localStorage.getItem('uid');
      if (currentUser && spreadSheetId) {
        const updateRef = firestore.doc(db, tag.sheetCollectionTag, currentUser);
        await firestore.setDoc(updateRef, {
          spreadSheetId,
          spreadSheetLink,
        });
      }
    }
    updateData(data)

  }, [data]);
  return [data, setData];
};

export default SheetStorage;
