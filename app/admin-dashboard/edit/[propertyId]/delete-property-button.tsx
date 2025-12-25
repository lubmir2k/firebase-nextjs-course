"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/auth";
import { storage } from "@/firebase/client";
import { deleteObject, ref } from "firebase/storage";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { deleteProperty } from "./actions";

type Props = {
  propertyId: string;
  images: string[];
};

export default function DeletePropertyButton({ propertyId, images }: Props) {
  const auth = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    const authToken = await auth.currentUser?.getIdToken();

    if (!authToken) {
      return;
    }

    setIsDeleting(true);
    try {
      const deletePromises = images.map((image) => deleteObject(ref(storage, image)));
      await Promise.all(deletePromises);

      const response = await deleteProperty(propertyId, authToken);

      if (response?.error) {
        toast.error(response.message);
        return;
      }

      toast.success("Property deleted successfully");
      router.push("/admin-dashboard");
    } catch (e) {
      console.error("Failed to delete property:", e);
      toast.error("An error occurred while deleting the property");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this property?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and will remove the property and all its
            images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Property"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
