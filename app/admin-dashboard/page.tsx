import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import PropertiesTable from "./properties-table";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const searchParamsValue = await searchParams;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <h1 className="text-4xl font-bold mt-6">Admin Dashboard</h1>
      <Button asChild className="inline-flex pl-2 gap-2 mt-4">
        <Link href="/admin-dashboard/new">
          <PlusCircle /> New Property
        </Link>
      </Button>
      <PropertiesTable
        page={searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1}
      />
    </div>
  );
}
