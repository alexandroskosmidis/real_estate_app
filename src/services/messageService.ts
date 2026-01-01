type SendMessagePayload = {
  content: string;
  property_id: number;
    sender_id: number;
};

export async function sendMessage(data: SendMessagePayload) {
  const res = await fetch(
    "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/messages/send_message.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}
