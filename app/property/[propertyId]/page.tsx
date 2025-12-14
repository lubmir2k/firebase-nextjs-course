import { getPropertyById } from "@/data/properties";
import { BedIcon, BathIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import PropertyStatusBadge from "@/components/property-status-badge";
import numeral from "numeral";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import BackButton from "./back-button";

type Props = {
  params: Promise<{ propertyId: string }>;
};

export default async function Property({ params }: Props) {
  const { propertyId } = await params;
  const property = await getPropertyById(propertyId);

  if (!property) {
    notFound();
  }

  const addressLines = [
    property.address1,
    property.address2,
    property.city,
    property.postcode,
  ].filter((addressLine) => !!addressLine);

  return (
    <div className="grid grid-cols-[1fr_500px]">
      <div>
        {property.images && (
          <Carousel className="w-full">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={image}>
                  <div className="relative h-[80vh] min-h-80">
                    <Image
                      src={`https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}/o/${encodeURIComponent(image)}?alt=media`}
                      alt={`Property at ${property.address1}, image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {property.images.length > 1 && (
              <>
                <CarouselPrevious className="translate-x-24 size-12" />
                <CarouselNext className="-translate-x-24 size-12" />
              </>
            )}
          </Carousel>
        )}
        <div className="property-description max-w-screen-md mx-auto py-10 px-4">
          <BackButton />
          <ReactMarkdown>{property.description}</ReactMarkdown>
        </div>
      </div>
      <div className="h-screen sticky top-0 grid place-items-center p-10">
        <div className="flex flex-col gap-10 w-full">
          <PropertyStatusBadge
            status={property.status}
            className="mr-auto text-base"
          />
          <h1 className="text-4xl font-semibold">
            {addressLines.map((addressLine, index) => (
              <span key={index}>
                {addressLine}
                {index < addressLines.length - 1 && ", "}
              </span>
            ))}
          </h1>
          <h2 className="text-3xl font-light">
            £{numeral(property.price).format("0,0")}
          </h2>
          <div className="flex gap-10">
            <div className="flex gap-2 items-center">
              <BedIcon />
              {property.bedrooms} Bedrooms
            </div>
            <div className="flex gap-2 items-center">
              <BathIcon />
              {property.bathrooms} Bathrooms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
