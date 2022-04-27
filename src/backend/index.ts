import firebase from './api/helper/firebase';
import sheets from './api/helper/sheet';
import general from './api/helper/general';
import { getSpreadSheetValue } from './api/v1/sheet/get';
const backendFunction = {
  firebase,
  sheets,
  general,
};

export { getSpreadSheetValue }

export default backendFunction;
