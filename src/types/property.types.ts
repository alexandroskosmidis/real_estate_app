export interface Property {
  property_id: number;

  purpose: "rent" | "buy";
  square_meters: number;
  price: number;
  rooms: number;
  floor: number;

  location: {
    city: string;
    area: string;
    address: string;
  };

  photo_url?: string;
}
