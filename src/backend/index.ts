import firebase from './src/api/firebase';
import sheets from './src/api/sheet';
import general from './src/api/general';
import { getSpreadSheetValue } from './src/routes/v1/sheet/get';
const backendFunction = {
  firebase,
  sheets,
  general,
};

export { getSpreadSheetValue }

export default backendFunction;
