import type { Message } from "../types/message.types";
import { API_BASE } from "../config/api";

export async function fetchMyMessages(userId: number): Promise<Message[]> {
  const res = await fetch(
    `${API_BASE}/messages/getMyMessages.php?user_id=${userId}`
  );
  const data = await res.json();
  return data as Message[];
}
