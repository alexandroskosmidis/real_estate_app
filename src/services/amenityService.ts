import { API_BASE } from "../config/api";

export async function fetchAmenities(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/amenities/get_all.php`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
