import { useEffect, useState } from 'react';
import tag from '../config/tag.json';
import * as firestore from "firebase/firestore/lite";
import * as firebase from 'firebase/app';

const _formSheets = (
  currentData: any, spreadSheetId: String, spreadSheetLink: String, name: string
) => {
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
  return sheets
}

const sheetStorage = () => {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const updateData = async (data: any) => {
      const { spreadSheetId, spreadSheetLink, firebaseConfig, name } = data;
      let app;

      try {
        app = firebase.getApp(tag.firebaseTag);
      } catch (error) {
        app = firebase.initializeApp(
          { ...firebaseConfig, projectId: process.env.PROJECT_ID }, tag.firebaseTag
        );
      }

      const db = firestore.getFirestore(app);
      const currentUser = window.localStorage.getItem('uid');

      if (!(currentUser && spreadSheetId)) {
        return
      }
      const updateRef = firestore.doc(db, tag.sheetCollectionTag, currentUser);
      const currentData = await firestore.getDoc(updateRef);
      let sheets = _formSheets(currentData, spreadSheetId, spreadSheetLink, name)

      await firestore.setDoc(updateRef, {
        spreadSheetId,
        sheets: sheets ? sheets : [],
        spreadSheetLink,
      });
      window.localStorage.setItem('sheetId', spreadSheetId);
      window.localStorage.setItem('sheetLink', spreadSheetLink);
    }
    updateData(data)

  }, [data]);
  return [data, setData];
};

export default sheetStorage;
