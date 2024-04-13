import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const fsConfig = {
  apiKey: "AIzaSyCFxFFS7uwGDZMCquR2dviHEv83korZMvU",
  authDomain: "scallops-9ac2b.firebaseapp.com",
  projectId: "scallops-9ac2b",
  storageBucket: "scallops-9ac2b.appspot.com",
  messagingSenderId: "139381698818",
  appId: "1:139381698818:web:c4d219c00e89813896121b",
};

const fsApp = initializeApp(fsConfig);
export const fsStorage = getStorage(fsApp);

export default fsApp;
