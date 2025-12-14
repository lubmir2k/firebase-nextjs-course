import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProperties } from "@/data/properties";
import FiltersForm from "./filters-form";
import Image from "next/image";
import imageUrlFormatter from "@/lib/imageUrlFormatter";
import { HomeIcon, BedIcon, BathIcon } from "lucide-react";
import numeral from "numeral";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    minBedrooms?: string;
  }>;
};

export default async function PropertySearch({ searchParams }: Props) {
  const searchParamsValues = await searchParams;

  const parsedPage = parseInt(searchParamsValues.page ?? "");
  const page = isNaN(parsedPage) ? 1 : parsedPage;

  const parsedMinPrice = parseInt(searchParamsValues.minPrice ?? "");
  const minPrice = isNaN(parsedMinPrice) ? null : parsedMinPrice;

  const parsedMaxPrice = parseInt(searchParamsValues.maxPrice ?? "");
  const maxPrice = isNaN(parsedMaxPrice) ? null : parsedMaxPrice;

  const parsedMinBedrooms = parseInt(searchParamsValues.minBedrooms ?? "");
  const minBedrooms = isNaN(parsedMinBedrooms) ? null : parsedMinBedrooms;

  const { data, totalPages } = await getProperties({
    pagination: {
      page,
      pageSize: 3,
    },
    filters: {
      minPrice,
      maxPrice,
      minBedrooms,
      status: ["for-sale"],
    },
  });

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-4xl font-bold p-5">Property Search</h1>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <FiltersForm />
          </Suspense>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-5 mt-5">
        {data.length === 0 && (
          <p className="col-span-3 text-center text-muted-foreground py-10">
            No properties found matching your criteria.
          </p>
        )}
        {data.map((property) => {
          const addressLines = [
            property.address1,
            property.address2,
            property.city,
            property.postcode,
          ]
            .filter((line) => line)
            .join(", ");

          return (
            <Card key={property.id} className="overflow-hidden">
              <CardContent className="px-0 pb-0">
                {property.images && property.images[0] && (
                  <div className="h-40 relative">
                    <Image
                      fill
                      className="object-cover"
                      src={imageUrlFormatter(property.images[0])}
                      alt={`Property at ${addressLines}`}
                    />
                  </div>
                )}
                {!property.images?.[0] && (
                  <div className="h-40 relative bg-sky-50 text-zinc-400 flex flex-col justify-center items-center">
                    <HomeIcon />
                    <small>No Image</small>
                  </div>
                )}
                <div className="flex flex-col gap-5 p-5">
                  <div>{addressLines}</div>
                  <div className="flex gap-5">
                    <div className="flex gap-2 items-center">
                      <BedIcon /> {property.bedrooms}
                    </div>
                    <div className="flex gap-2 items-center">
                      <BathIcon /> {property.bathrooms}
                    </div>
                  </div>
                  <p className="text-2xl">
                    £{numeral(property.price).format("0,0")}
                  </p>
                  <Button asChild>
                    <Link href={`/property/${property.id}`}>View Property</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex gap-2 items-center justify-center py-10">
        {Array.from({ length: totalPages }).map((_, i) => {
          const newSearchParams = new URLSearchParams();

          if (searchParamsValues.minPrice) {
            newSearchParams.set("minPrice", searchParamsValues.minPrice);
          }

          if (searchParamsValues.maxPrice) {
            newSearchParams.set("maxPrice", searchParamsValues.maxPrice);
          }

          if (searchParamsValues.minBedrooms) {
            newSearchParams.set("minBedrooms", searchParamsValues.minBedrooms);
          }

          newSearchParams.set("page", (i + 1).toString());

          return (
            <Button
              asChild={page !== i + 1}
              disabled={page === i + 1}
              variant="outline"
              key={i}
            >
              <Link href={`/property-search?${newSearchParams.toString()}`}>
                {i + 1}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
