export type Property = {
  property_id: number;
  price: number;
  square_meters: number;
  rooms: number;
  floor: number;
  creation_date: string;
  purpose: "sale" | "rent";

  city: string;
  area: string;
  address: string;
  number: string;

  amenities: string[];
  photo_url: string;
};
