"use client";

import { z } from "zod";
import {
  ref,
  uploadBytesResumable,
  deleteObject,
  UploadTask,
} from "firebase/storage";
import { propertySchema } from "@/validation/propertySchema";
import { SaveIcon } from "lucide-react";
import PropertyForm from "@/components/property-form";
import { Property } from "@/types/property";
import { useAuth } from "@/context/auth";
import { updateProperty } from "./actions";
import { savePropertyImages } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { storage } from "@/firebase/client";

type PropertyData = z.infer<typeof propertySchema>;

type Props = {
  property: Property;
};

export default function EditPropertyForm({ property }: Props) {
  const auth = useAuth();
  const router = useRouter();
  const { images, id, ...propertyData } = property;

  const handleSubmit = async (data: PropertyData) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    const { images: newImages, ...rest } = data;

    const response = await updateProperty({ ...rest, id }, token);

    if (response?.error) {
      toast.error("Error", {
        description: response.message,
      });
      return;
    }

    // Create storage tasks for uploads and deletes
    const storageTasks: (UploadTask | Promise<void>)[] = [];

    // Identify images to delete (exist in original but not in new)
    const imagesToDelete = (images || []).filter((image) => {
      return !newImages?.find((newImage) => image === newImage.url);
    });

    // Create delete tasks
    imagesToDelete.forEach((image) => {
      storageTasks.push(deleteObject(ref(storage, image)));
    });

    // Handle new image uploads and existing images
    const paths: string[] = [];

    newImages?.forEach((image, index) => {
      if (image.file) {
        // New image to upload
        const path = `properties/${id}/${Date.now()}-${index}-${image.file.name}`;
        paths.push(path);

        const storageRef = ref(storage, path);
        storageTasks.push(uploadBytesResumable(storageRef, image.file));
      } else {
        // Existing image, keep the URL
        paths.push(image.url);
      }
    });

    // Wait for all storage operations to complete
    await Promise.all(storageTasks);

    // Save updated image paths to Firestore
    await savePropertyImages(id, paths, token);

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
