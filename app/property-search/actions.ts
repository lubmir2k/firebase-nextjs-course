"use server";

import { auth, firestore } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export const addFavorite = async (propertyId: string, authToken: string) => {
  const verifiedToken = await auth.verifyIdToken(authToken);

  if (!verifiedToken) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  await firestore
    .collection("favorites")
    .doc(verifiedToken.uid)
    .set(
      {
        [propertyId]: true,
      },
      { merge: true }
    );
};

export const removeFavourite = async (propertyId: string, authToken: string) => {
  const verifiedToken = await auth.verifyIdToken(authToken);

  if (!verifiedToken) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  await firestore
    .collection("favorites")
    .doc(verifiedToken.uid)
    .update({
      [propertyId]: FieldValue.delete(),
    });
};
