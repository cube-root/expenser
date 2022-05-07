import { useEffect, useState } from 'react';
import tag from '../config/tag.json';
import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';

const SheetStorage = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const updateData = async (data: any) => {
      const { spreadSheetId, spreadSheetLink, firebaseConfig, name } = data;
      let app;
      try {
        const firebaseApps = firebase.getApp(tag.firebaseTag);
        app = firebaseApps;
      } catch (error) {
        app = firebase.initializeApp({ ...firebaseConfig, projectId: process.env.PROJECT_ID }, tag.firebaseTag);
      }
      const db = firestore.getFirestore(app);
      const currentUser = window.localStorage.getItem('uid');
      if (currentUser && spreadSheetId) {
        const updateRef = firestore.doc(db, tag.sheetCollectionTag, currentUser);
        const currentData = await firestore.getDoc(updateRef);
        let sheets;
        if (currentData.exists()) {
          sheets = currentData.data().sheets;
          if (sheets) {
            const alreadyData = sheets.find((sheet: any) => sheet.id === spreadSheetId);
            if (!alreadyData) {
              sheets.push({
                id: spreadSheetId,
                link: spreadSheetLink,
                createdAt: new Date().toISOString(),
                name
              })
            }
          } else {
            sheets = [{
              id: spreadSheetId,
              link: spreadSheetLink,
              createdAt: new Date().toISOString(),
              name
            }];
          }
        } else {
          sheets = [{
            id: spreadSheetId,
            link: spreadSheetLink,
            createdAt: new Date().toISOString(),
            name
          }];
        }
        await firestore.setDoc(updateRef, {
          spreadSheetId,
          sheets: sheets ? sheets : [],
          spreadSheetLink,
        });
      }
    }
    updateData(data)

  }, [data]);
  return [data, setData];
};

export default SheetStorage;
