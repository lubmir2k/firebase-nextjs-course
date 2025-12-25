import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPropertyById } from "@/data/properties";
import { notFound } from "next/navigation";
import DeletePropertyButton from "./delete-property-button";
import EditPropertyForm from "./edit-property-form";

type Params = {
  params: Promise<{ propertyId: string }>;
};

export default async function EditProperty({ params }: Params) {
  const paramsValue = await params;
  const property = await getPropertyById(paramsValue.propertyId);

  if (!property) {
    notFound();
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            href: "/admin-dashboard",
            label: "Dashboard",
          },
          {
            label: "Edit Property",
          },
        ]}
      />
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex justify-between">
            Edit Property
            <DeletePropertyButton
              propertyId={property.id}
              images={property.images ?? []}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditPropertyForm property={property} />
        </CardContent>
      </Card>
    </div>
  );
}
