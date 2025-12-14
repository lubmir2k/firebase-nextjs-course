"use server";

import { z } from "zod";
import { auth, firestore } from "@/firebase/server";

const savePropertyImagesSchema = z.object({
  propertyId: z.string(),
  images: z.array(z.string()),
});

export const savePropertyImages = async (
  propertyId: string,
  images: string[],
  authToken: string
) => {
  try {
    const verifiedToken = await auth.verifyIdToken(authToken);

    if (!verifiedToken.admin) {
      return {
        error: true,
        message: "Unauthorized",
      };
    }
  } catch {
    return {
      error: true,
      message: "Authentication failed",
    };
  }

  const validation = savePropertyImagesSchema.safeParse({ propertyId, images });

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  await firestore.collection("properties").doc(propertyId).update({
    images,
  });
};
