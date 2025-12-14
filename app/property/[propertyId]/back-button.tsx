"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()} variant="link">
      <ArrowLeftIcon /> Back
    </Button>
  );
}
