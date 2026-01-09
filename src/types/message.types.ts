import type { Property } from "../components/PropertyCard/Property.types";

export interface Sender {
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Message {
  message_id: number;
  content: string;
  sent_at: string; 
  sender: Sender;

  property: Property;

}


