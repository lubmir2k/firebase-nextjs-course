import admin from "firebase-admin";
import { getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_PRIVATE_KEY
) {
  throw new Error("Firebase Admin SDK environment variables are not set.");
}

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
};

let firestore: Firestore;
let auth: Auth;

if (getApps().length) {
  firestore = getFirestore();
  auth = getAuth();
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  firestore = getFirestore();
  auth = getAuth();
}

export const getTotalPages = async (
  firestoreQuery: FirebaseFirestore.Query<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >,
  pageSize: number
) => {
  const queryCount = firestoreQuery.count();
  const countSnapshot = await queryCount.get();
  const countData = countSnapshot.data();
  const total = countData.count;

  const totalPages = Math.ceil(total / pageSize);
  return totalPages;
};

export { firestore, auth };
