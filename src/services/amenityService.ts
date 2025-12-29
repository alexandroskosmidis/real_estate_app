export async function fetchAmenities(): Promise<string[]> {
  const res = await fetch(
    "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/amenities/get_all.php"
  );
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
