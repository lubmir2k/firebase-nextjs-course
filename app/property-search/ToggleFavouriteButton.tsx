"use client";

import { HeartIcon } from "lucide-react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addFavorite, removeFavourite } from "./actions";

type Props = {
  propertyId: string;
  isFavourite: boolean;
};

export default function ToggleFavouriteButton({
  propertyId,
  isFavourite,
}: Props) {
  const auth = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    const tokenResult = await auth.currentUser?.getIdTokenResult();

    if (!tokenResult) {
      router.push("/login");
      return;
    }

    try {
      if (isFavourite) {
        await removeFavourite(propertyId, tokenResult.token);
      } else {
        await addFavorite(propertyId, tokenResult.token);
      }

      toast.success(
        `Property ${isFavourite ? "removed from" : "added to"} favourites`
      );
      router.refresh();
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-0 right-0 z-10 p-2 bg-white rounded-bl-lg"
    >
      <HeartIcon
        className="text-black"
        fill={isFavourite ? "#db2777" : "white"}
      />
    </button>
  );
}
