"use client";

import { Button } from "./ui/button";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

export default function ContinueWithGoogleButton() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await auth.loginWithGoogle();
      router.refresh();
    } catch {
      // User closed the popup - no action needed
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleLogin}>
      Continue with Google
    </Button>
  );
}
