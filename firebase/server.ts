import {
  initializeApp,
  getApps,
  getApp,
  ServiceAccount,
  cert,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

const serviceAccount: ServiceAccount = {
  projectId: "YOUR_PROJECT_ID",
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

let firestore: Firestore;

const currentApps = getApps();

if (currentApps.length <= 0) {
  const app = initializeApp({
    credential: cert(serviceAccount),
  });
  firestore = getFirestore(app);
} else {
  const app = getApp();
  firestore = getFirestore(app);
}

export { firestore };
