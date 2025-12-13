"use client";

import { Button } from "./ui/button";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export default function ContinueWithGoogleButton() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    await auth.loginWithGoogle();
    router.refresh();
  };

  return (
    <Button className="w-full" onClick={handleLogin}>
      Continue with Google
    </Button>
  );
}
