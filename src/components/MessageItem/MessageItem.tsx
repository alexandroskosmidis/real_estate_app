import { useState } from "react";
import type { Message } from "../../types/message.types";
import type { Property } from '../../components/PropertyCard/Property.types';
import PropertyCard from "../PropertyCard/PropertyCard";
import "./MessageItem.css";

type MessageItemProps = { 
  message: Message; 
  initialOpen?: boolean;
  property: Property;
};

export default function MessageItem({ message, property, initialOpen = false }: MessageItemProps) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <div className={"message-item"}>
      <div className="message-header" onClick={() => setOpen(!open)}>
        From: <strong>{message.sender.name}</strong>
        <span>{new Date(message.sent_at).toLocaleDateString()}</span>
      <span className="arrow">{open ? '▼' : '▶'}</span>
      </div>

      {open && (
        <div className="message-body">
          <p>{message.content}</p>
          <hr />
          <p>Email: {message.sender.email}</p>
          <p>Phone: {message.sender.phone}</p>
        </div>
      )}

      <div className="message-property-container">
            <h4>Interested in:</h4>
            {/* Χρησιμοποιούμε το isReadOnly={true} που φτιάξαμε πριν */}
            <PropertyCard property={property} isReadOnly={true} />
          </div>
    </div>
  );
}
