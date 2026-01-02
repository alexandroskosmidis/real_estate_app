export interface Sender {
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Message {
  message_id: number;
  content: string;
  sent_at: string; // ISO datetime from backend
  sender: Sender;
}
