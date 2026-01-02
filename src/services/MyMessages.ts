import type { Message } from "../types/message.types";

export async function fetchMyMessages(userId: number): Promise<Message[]> {
  const res = await fetch(
    `http://localhost/api/messages/getMyMessages.php?user_id=${userId}`
  );
  const data = await res.json();
  return data as Message[];
}
