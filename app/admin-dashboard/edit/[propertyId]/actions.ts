"use server";

import { auth, firestore } from "@/firebase/server";
import { Property } from "@/types/property";
import { propertyDataSchema } from "@/validation/propertySchema";
import { revalidatePath } from "next/cache";

export const updateProperty = async (data: Property, authToken: string) => {
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

  const { id, ...propertyData } = data;
  const validation = propertyDataSchema.safeParse(propertyData);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  await firestore.collection("properties").doc(id).update({
    ...propertyData,
    updated: new Date(),
  });

  revalidatePath(`/property/${id}`);
};

export const deleteProperty = async (propertyId: string, authToken: string) => {
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

  try {
    await firestore.collection("properties").doc(propertyId).delete();
    revalidatePath(`/property/${propertyId}`);
    revalidatePath("/property-search");
  } catch (e) {
    console.error("Failed to delete property:", e);
    return {
      error: true,
      message: "Failed to delete property",
    };
  }
};
