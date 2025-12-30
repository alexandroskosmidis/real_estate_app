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
  ): Promise<CreatePropertyResponse> {
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

  export type CreatePropertyResponse = {
    success: boolean;
    property_id: number;
  };


  export async function uploadPropertyPhoto(
    propertyId: number,
    file: File
  ): Promise<void> {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("property_id", propertyId.toString());

    const res = await fetch(
      "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/properties/upload_photo.php",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to upload photo");
    }
  }


