export type CreatePropertyPayload = {
  purpose: "sale" | "rent";
  square_meters: number;
  price: number;
  creation_date: string;
  rooms: number;
  floor: number;

  city: string;
  area: string;
  address: string;
  number: string;
  postal_code: string;

  amenities: string[];
};
