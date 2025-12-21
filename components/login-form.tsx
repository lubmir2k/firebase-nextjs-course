"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
});

type Props = {
  onSuccess?: () => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await auth.loginWithEmail(data.email, data.password);
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (e: unknown) {
      const isInvalidCredential =
        e instanceof Object && "code" in e && e.code === "auth/invalid-credential";
      toast.error("Error", {
        description: isInvalidCredential
          ? "Incorrect credentials"
          : "An error occurred",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
          <div>
            Forgotten your password?
            <Link href="/forgot-password" className="pl-2 underline">
              Reset it here
            </Link>
          </div>
          <div className="text-center pb-5">Or</div>
        </fieldset>
      </form>
      <ContinueWithGoogleButton />
    </Form>
  );
}
