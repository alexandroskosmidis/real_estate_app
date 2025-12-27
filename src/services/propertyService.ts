import type { Property } from "../components/PropertyCard/Property.types";

const API_URL =
  "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/properties/get_all.php";

export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  return res.json();
}
