import ContinueWithGoogleButton from "@/components/continue-with-google-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Register() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <ContinueWithGoogleButton />
      </CardContent>
    </Card>
  );
}
