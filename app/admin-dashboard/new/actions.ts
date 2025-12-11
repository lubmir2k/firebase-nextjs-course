"use server";

import { auth, firestore } from "@/firebase/server";
import { propertyDataSchema } from "@/validation/propertySchema";
import { z } from "zod";

type PropertyData = z.infer<typeof propertyDataSchema>;

export const createProperty = async (data: PropertyData, authToken: string) => {
  const verifiedToken = await auth.verifyIdToken(authToken);

  if (!verifiedToken.admin) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }

  const validation = propertyDataSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  const property = await firestore.collection("properties").add({
    ...data,
    created: new Date(),
    updated: new Date(),
  });

  return {
    propertyId: property.id,
  };
};
