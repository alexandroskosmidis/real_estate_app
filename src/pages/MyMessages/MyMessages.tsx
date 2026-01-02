import { useEffect, useState } from "react";
import { fetchMyMessages } from "../../services/MyMessages";
import MessageItem from "../../components/MessageItem/MessageItem";
import type { Message } from "../../types/message.types";

export default function MyMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) return;

    fetchMyMessages(user.user_id)
      .then(setMessages)
      .catch(err => console.error(err));
  }, [user]);

  if (!user) {
    return <p>Please login to view your messages</p>;
  }

  return (
    <div className="my-messages-page">
      <h2>My Messages</h2>

      {messages.length === 0 && <p>No messages</p>}

      {messages.map(msg => (
        <MessageItem key={msg.message_id} message={msg} />
      ))}
    </div>
  );
}
