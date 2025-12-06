import {
  initializeApp,
  getApps,
  getApp,
  ServiceAccount,
  cert,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("Firebase Admin SDK environment variables are not set.");
}

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount),
    });

const firestore: Firestore = getFirestore(app);

export { firestore };
