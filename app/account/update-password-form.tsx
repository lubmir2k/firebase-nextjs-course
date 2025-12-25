"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { passwordValidation } from "@/validation/registerUser";
import { useAuth } from "@/context/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const formSchema = z
  .object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    newPasswordConfirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.newPasswordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["newPasswordConfirm"],
      });
    }
  });

export default function UpdatePasswordForm() {
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const handleUpdatePassword = async (data: z.infer<typeof formSchema>) => {
    const user = auth.currentUser;
    if (!user || !user.email) return;

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, data.newPassword);

      toast.success("Password updated successfully");
      form.reset();
    } catch (e: unknown) {
      console.error("Failed to update password:", e);
      const error = e as { code?: string };
      toast.error(
        error.code === "auth/invalid-credential"
          ? "Your current password is incorrect"
          : "An error occurred"
      );
    }
  };

  return (
    <div className="pt-5 mt-5 border-t">
      <h2 className="text-2xl font-bold pb-2">Update Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdatePassword)}>
          <fieldset
            className="flex flex-col gap-4"
            disabled={form.formState.isSubmitting}
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Current Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPasswordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Password</Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
