"use client";

import { z } from "zod";
import { propertyDataSchema } from "@/validation/propertySchema";
import { SaveIcon } from "lucide-react";
import PropertyForm from "@/components/property-form";
import { Property } from "@/types/property";
import { useAuth } from "@/context/auth";
import { updateProperty } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PropertyData = z.infer<typeof propertyDataSchema>;

type Props = {
  property: Property;
};

export default function EditPropertyForm({ property }: Props) {
  const auth = useAuth();
  const router = useRouter();
  const { images, ...propertyData } = property;

  const handleSubmit = async (data: PropertyData) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    const response = await updateProperty({ ...data, id: property.id }, token);

    if (response?.error) {
      toast.error("Error", {
        description: response.message,
      });
      return;
    }

    toast.success("Success", {
      description: "Property updated",
    });

    router.push("/admin-dashboard");
  };

  return (
    <PropertyForm
      handleSubmit={handleSubmit}
      submitButtonLabel={
        <>
          <SaveIcon /> Save Property
        </>
      }
      defaultValues={{
        ...propertyData,
        images: images
          ? images.map((image) => ({
              id: image,
              url: image,
            }))
          : [],
      }}
    />
  );
}
