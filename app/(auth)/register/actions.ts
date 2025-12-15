"use server";

import { registerUserSchema } from "@/validation/registerUser";
import { auth } from "@/firebase/server";

export const registerUser = async (data: {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}) => {
  const validation = registerUserSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  const { email, password, name } = data;

  try {
    await auth.createUser({
      displayName: name,
      email: email,
      password: password,
    });

    return { error: false, message: "User registered" };
  } catch (e: unknown) {
    const error = e as { message?: string };
    return {
      error: true,
      message: error.message ?? "Could not register user",
    };
  }
};
