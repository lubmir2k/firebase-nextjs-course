"use client";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { removeFavourite } from "@/app/property-search/actions";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  propertyId: string;
};

export default function RemoveFavouriteButton({ propertyId }: Props) {
  const auth = useAuth();
  const router = useRouter();

  const onClick = async () => {
    const tokenResult = await auth.currentUser?.getIdTokenResult();
    if (!tokenResult) return;

    try {
      await removeFavourite(propertyId, tokenResult.token);
      toast.success("Property removed from favourites");
      router.refresh();
    } catch (error) {
      console.error("Failed to remove property from favourites:", error);
      toast.error("Failed to remove property from favourites");
    }
  };

  return (
    <Button variant="outline" onClick={onClick}>
      <Trash2Icon />
    </Button>
  );
}
