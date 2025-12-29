import type { Property } from "../components/PropertyCard/Property.types";
import type { CreatePropertyPayload } from "../pages/CreatePropertyPage/property.types";

const API_BASE =
  "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/properties";

  export async function fetchProperties(): Promise<Property[]> {
    const res = await fetch(`${API_BASE}/get_all.php`);

    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }

    return res.json();
  }

  export async function createProperty(
    data: CreatePropertyPayload
  ): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/create.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Failed to create property");
    }

    return res.json();
  }

