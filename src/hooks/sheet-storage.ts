import { useEffect, useState } from 'react';
import { firestoreSheetCollectionTag, firebaseTag } from '../config/tag';
import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';

const SheetStorage = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const updateData = async (data: any) => {
      const { spreadSheetId, spreadSheetLink, firebaseConfig } = data;
      let app;
      try {
        const firebaseApps = firebase.getApp(firebaseTag);
        app = firebaseApps;
      } catch (error) {
        app = firebase.initializeApp({ ...firebaseConfig, projectId: process.env.PROJECT_ID }, firebaseTag);
      }
      const db = firestore.getFirestore(app);
      // const collection: any = firestore.collection(db, firestoreSheetCollectionTag);
      const currentUser = window.sessionStorage.getItem('uid');
      if (currentUser && spreadSheetId) {
        const updateRef = firestore.doc(db, firestoreSheetCollectionTag, currentUser);
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
