import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "@/components/login-form";

export default function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter>
        Don&apos;t have an account?
        <Link href="/register" className="pl-2 underline">
          Register here
        </Link>
      </CardFooter>
    </Card>
  );
}
