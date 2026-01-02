import type { Message } from "../types/message.types";

export async function fetchMyMessages(userId: number): Promise<Message[]> {
  const res = await fetch(
    `https://dblab.nonrelevant.net/~lab2526omada2/backend/api/messages/getMyMessages.php?user_id=${userId}`
  );
  const data = await res.json();
  return data as Message[];
}
