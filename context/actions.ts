"use server";

import { auth } from "@/firebase/server";
import { cookies } from "next/headers";

export const setToken = async ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => {
  try {
    const verifiedToken = await auth.verifyIdToken(token);
    if (!verifiedToken) return;

    // Check if user should be admin and set custom claim
    const userRecord = await auth.getUser(verifiedToken.uid);

    if (
      process.env.ADMIN_EMAIL === userRecord.email &&
      userRecord.customClaims?.admin !== true
    ) {
      await auth.setCustomUserClaims(verifiedToken.uid, { admin: true });
    }

    // Set cookies
    const cookieStore = await cookies();

    cookieStore.set("firebaseAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const removeToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("firebaseAuthToken");
  cookieStore.delete("firebaseAuthRefreshToken");
};
