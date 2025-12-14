"use client";

import { z } from "zod";
import { ref, uploadBytesResumable, UploadTask } from "firebase/storage";
import { propertySchema } from "@/validation/propertySchema";
import PropertyForm from "@/components/property-form";
import { PlusCircleIcon } from "lucide-react";
import { useAuth } from "@/context/auth";
import { createProperty } from "./actions";
import { savePropertyImages } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storage } from "@/firebase/client";

type PropertyData = z.infer<typeof propertySchema>;

export default function NewPropertyForm() {
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: PropertyData) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    const { images, ...rest } = data;

    const response = await createProperty(rest, token);

    if (response.error) {
      toast.error("Error", {
        description: response.message,
      });
      return;
    }

    if (!response.propertyId) {
      toast.error("Error", {
        description: "Failed to create property",
      });
      return;
    }

    // Upload images to Firebase Storage
    const uploadTasks: UploadTask[] = [];
    const paths: string[] = [];

    images?.forEach((image) => {
      if (image.file) {
        const path = `properties/${response.propertyId}/${crypto.randomUUID()}-${image.file.name}`;
        paths.push(path);

        const storageRef = ref(storage, path);
        uploadTasks.push(uploadBytesResumable(storageRef, image.file));
      }
    });

    await Promise.all(uploadTasks);

    // Save image paths to Firestore
    if (paths.length > 0) {
      await savePropertyImages(response.propertyId, paths, token);
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
