import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProperties } from "@/data/properties";
import FiltersForm from "./filters-form";

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

  const properties = await getProperties({
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

  console.log(properties);

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
    </div>
  );
}
