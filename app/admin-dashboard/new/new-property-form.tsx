"use client";

import { z } from "zod";
import { propertyDataSchema } from "@/validation/propertySchema";
import PropertyForm from "@/components/property-form";
import { PlusCircleIcon } from "lucide-react";
import { useAuth } from "@/context/auth";
import { createProperty } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PropertyData = z.infer<typeof propertyDataSchema>;

export default function NewPropertyForm() {
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: PropertyData) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    const response = await createProperty(data, token);

    if (response.error) {
      toast.error("Error", {
        description: response.message,
      });
      return;
    }

    toast.success("Success", {
      description: "Property created",
    });

    router.push("/admin-dashboard");
  };

  return (
    <PropertyForm
      handleSubmit={handleSubmit}
      submitButtonLabel={
        <>
          <PlusCircleIcon /> Create Property
        </>
      }
    />
  );
}
