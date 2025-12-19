"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/login-form";
import { loginSuccess } from "./actions";

export default function LoginModal() {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        router.back();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            You must be logged in to favorite a property.
          </DialogDescription>
        </DialogHeader>
        <LoginForm
          onSuccess={async () => {
            await loginSuccess();
            router.back();
          }}
        />
        <DialogFooter className="block">
          <div className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline pl-2">
              Register here.
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
