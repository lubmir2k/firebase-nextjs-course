import "server-only";
import { firestore, getTotalPages } from "@/firebase/server";
import { PropertyStatus } from "@/types/propertyStatus";
import { Property } from "@/types/property";

type GetPropertiesOptions = {
  filters?: {
    minPrice?: number | null;
    maxPrice?: number | null;
    minBedrooms?: number | null;
    status?: PropertyStatus[] | null;
  };
  pagination?: {
    pageSize?: number;
    page?: number;
  };
};

export const getProperties = async (options?: GetPropertiesOptions) => {
  const page = options?.pagination?.page || 1;
  const pageSize = options?.pagination?.pageSize || 10;

  const { minPrice, maxPrice, minBedrooms, status } = options?.filters || {};

  let propertiesQuery = firestore
    .collection("properties")
    .orderBy("updated", "desc");

  if (minPrice !== null && minPrice !== undefined) {
    propertiesQuery = propertiesQuery.where("price", ">=", minPrice);
  }

  if (maxPrice !== null && maxPrice !== undefined) {
    propertiesQuery = propertiesQuery.where("price", "<=", maxPrice);
  }

  if (minBedrooms !== null && minBedrooms !== undefined) {
    propertiesQuery = propertiesQuery.where("bedrooms", ">=", minBedrooms);
  }

  if (status) {
    propertiesQuery = propertiesQuery.where("status", "in", status);
  }

  const totalPages = await getTotalPages(propertiesQuery, pageSize);

  const propertiesSnapshot = await propertiesQuery
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .get();

  const properties = propertiesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      postcode: data.postcode,
      price: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      description: data.description,
      status: data.status,
      images: data.images,
      created: data.created?.toDate().toISOString(),
      updated: data.updated?.toDate().toISOString(),
    } as Property;
  });

  return { data: properties, totalPages };
};

export const getPropertyById = async (propertyId: string) => {
  const propertySnapshot = await firestore
    .collection("properties")
    .doc(propertyId)
    .get();

  const data = propertySnapshot.data();

  if (!data) {
    return null;
  }

  const property: Property = {
    id: propertySnapshot.id,
    address1: data.address1,
    address2: data.address2,
    city: data.city,
    postcode: data.postcode,
    price: data.price,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    description: data.description,
    status: data.status,
    images: data.images,
    created: data.created?.toDate().toISOString(),
    updated: data.updated?.toDate().toISOString(),
  };

  return property;
};
