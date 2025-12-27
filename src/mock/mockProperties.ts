import type { Property } from "../components/PropertyCard/Property.types";

export const mockProperties: Property[] = [
  {
    property_id: 1,
    price: 120000,
    square_meters: 85,
    rooms: 3,
    floor: 2,
    creation_date: "2025-01-10",
    purpose: "sale",

    city: "Athens",
    area: "Kallithea",
    address: "Example Street",
    number: "12",

    amenities: ["Parking", "Elevator", "Balcony"],
    photo_url: "C:/Users/Alexandros/Pictures/property_1.png",
  },
  {
    property_id: 2,
    price: 750,
    square_meters: 60,
    rooms: 2,
    floor: 1,
    creation_date: "2025-02-05",
    purpose: "rent",

    city: "Thessaloniki",
    area: "Center",
    address: "Tsimiski",
    number: "45",

    amenities: ["Furnished", "Air Condition"],
    photo_url: "C:/Users/Alexandros/Pictures/property_2.png",
  },
];
