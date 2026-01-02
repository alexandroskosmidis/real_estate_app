import { useState } from "react";
import type { Message } from "../../types/message.types";

type MessageItemProps = { message: Message };

export default function MessageItem({ message }: MessageItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="message-item" onClick={() => setOpen(!open)}>
      <div className="message-header">
        From: <strong>{message.sender.name}</strong>
        <span>{new Date(message.sent_at).toLocaleDateString()}</span>
      </div>

      {open && (
        <div className="message-body">
          <p>{message.content}</p>
          <hr />
          <p>Email: {message.sender.email}</p>
          <p>Phone: {message.sender.phone}</p>
        </div>
      )}
    </div>
  );
}
