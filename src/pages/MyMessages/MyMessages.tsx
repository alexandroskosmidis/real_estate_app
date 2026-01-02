import { useEffect, useState } from "react";
import { fetchMyMessages } from "../../services/MyMessages";
import MessageItem from "../../components/MessageItem/MessageItem";
import type { Message } from "../../types/message.types";
import "./MyMessages.css";

export default function MyMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

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

      {messages.map((msg) => (
        <div key={msg.message_id} className="message-preview">
          <div className="preview-header">
            <strong>{msg.sender.name}</strong>
            <span className="preview-date">
              {new Date(msg.sent_at).toLocaleDateString()}
            </span>
          </div>
          <button
            className="read-button"
            onClick={() =>
              setOpenId(openId === msg.message_id ? null : msg.message_id)
            }
          >
            Read the Message
          </button>

          {openId === msg.message_id && (
            <MessageItem message={msg} initialOpen={true} />
          )}
        </div>
      ))}
    </div>
  );
}
