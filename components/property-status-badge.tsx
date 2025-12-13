import { PropertyStatus } from "@/types/propertyStatus";
import { Badge } from "./ui/badge";

const statusLabel: Record<PropertyStatus, string> = {
  "for-sale": "For Sale",
  withdrawn: "Withdrawn",
  draft: "Draft",
  sold: "Sold",
};

const variant: Record<
  PropertyStatus,
  "default" | "secondary" | "destructive" | "outline" | "success" | "primary"
> = {
  "for-sale": "primary",
  withdrawn: "destructive",
  draft: "secondary",
  sold: "success",
};

export default function PropertyStatusBadge({
  status,
}: {
  status: PropertyStatus;
}) {
  const label = statusLabel[status];
  return <Badge variant={variant[status]}>{label}</Badge>;
}
