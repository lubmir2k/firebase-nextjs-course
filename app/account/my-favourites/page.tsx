import { getUserFavourites } from "@/data/favourites";
import { getPropertiesById } from "@/data/properties";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PropertyStatusBadge from "@/components/property-status-badge";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import RemoveFavouriteButton from "./remove-favourite-button";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MyFavourites({ searchParams }: Props) {
  const favourites = await getUserFavourites();
  const pageSize = 2;

  // Convert map to array of IDs
  const allFavourites = Object.keys(favourites);
  const totalPages = Math.ceil(allFavourites.length / pageSize);

  // Get page from search params
  const searchParamsValues = await searchParams;
  const parsedPage = Number(searchParamsValues?.page);
  const page = parsedPage > 0 ? parsedPage : 1;

  // Paginate the IDs
  const paginatedFavourites = allFavourites.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Handle empty page redirect (e.g., after deleting last item on page)
  if (paginatedFavourites.length === 0 && page > 1) {
    redirect(`/account/my-favourites?page=${totalPages}`);
  }

  // Fetch property details for current page
  const properties = await getPropertiesById(paginatedFavourites);

  return (
    <div className="max-w-screen-lg mx-auto">
      <h1 className="text-4xl font-bold py-4 mt-5">My Favourites</h1>
      {!paginatedFavourites.length && (
        <h2 className="text-center text-zinc-400 text-3xl font-bold py-10">
          You have no favourited properties.
        </h2>
      )}
      {!!paginatedFavourites.length && (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFavourites.map((favourite) => {
              const property = properties.find((p) => p.id === favourite);
              const address = [
                property?.address1,
                property?.address2,
                property?.city,
                property?.postcode,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <TableRow key={favourite}>
                  <TableCell>{address}</TableCell>
                  <TableCell>
                    {property && (
                      <PropertyStatusBadge status={property.status} />
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-1">
                    {property && (
                      <>
                        <Button asChild variant="outline">
                          <Link href={`/property/${property.id}`}>
                            <EyeIcon />
                          </Link>
                        </Button>
                        <RemoveFavouriteButton propertyId={property.id} />
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    disabled={page === i + 1}
                    key={i}
                    asChild={page !== i + 1}
                    variant="outline"
                    className="mx-1"
                  >
                    <Link href={`/account/my-favourites?page=${i + 1}`}>
                      {i + 1}
                    </Link>
                  </Button>
                ))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}
