import { getPropertyById } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ propertyId: string }>;
};

export default async function Property({ params }: Props) {
  const { propertyId } = await params;
  const property = await getPropertyById(propertyId);

  if (!property) {
    notFound();
  }

  return (
    <div className="grid grid-cols-[1fr,400px]">
      <div>
        <div>carousel</div>
        <div className="property-description max-w-screen-md mx-auto py-10 px-4">
          <Button>
            <ArrowLeftIcon /> Back
          </Button>
          <ReactMarkdown>{property.description}</ReactMarkdown>
        </div>
      </div>
      <div className="bg-sky-200 h-screen sticky top-0">
        property details
      </div>
    </div>
  );
}
