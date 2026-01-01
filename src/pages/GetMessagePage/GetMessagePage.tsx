import { useEffect, useState } from 'react';
import { fetchMyMessages, type Message } from '../../services/GetMessageService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpenText, faUser, faHome, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './GetMessagePage.css';



export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.user_id;
//   const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(!!userId);


  console.log("User Object from LocalStorage:", user);
  console.log("User ID being sent:", userId);





//   useEffect(() => {
//     if (user.user_id) {
//       fetchMyMessages(user.user_id).then((data) => {
//         setMessages(data);
//         setLoading(false);
//       });
//     }
//   }, [user.user_id]);

useEffect(() => {
    // Αν υπάρχει χρήστης, φέρε τα μηνύματα
    if (userId) {
      fetchMyMessages(userId).then((data) => {
        setMessages(data);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    } 
  }, [userId]);

if (loading) {
    return (
      <div className="messages-page" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <p>Φόρτωση μηνυμάτων...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="messages-page">
        <h2 className="page-title">My Messages</h2>
        <div className="empty-messages-container">
           <FontAwesomeIcon icon={faEnvelopeOpenText} className="empty-icon-large" />
           <h3>Δεν έχετε νέα μηνύματα</h3>
           <p>Όταν κάποιος ενδιαφερθεί για τα ακίνητά σας, τα μηνύματα θα εμφανιστούν εδώ.</p>
        </div>
      </div>
    );
  }



  return (
    <div className="messages-page">
      <h2 className="page-title">My Messages</h2>

      <div className="messages-container">
        
        {/* ΑΡΙΣΤΕΡΑ: ΛΙΣΤΑ */}
        <div className="messages-list">
            {messages.map((msg) => (
              <div 
                key={msg.message_id} 
                className={`message-card ${selectedMessage?.message_id === msg.message_id ? 'active' : ''}`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="msg-header">
                  <span className="msg-sender">{msg.sender_name}</span>
                  <span className="msg-date">{new Date(msg.sent_at).toLocaleDateString()}</span>
                </div>
                <div className="msg-property">
                  <FontAwesomeIcon icon={faHome} size="xs" /> {msg.property_city}, {msg.property_area}
                </div>
                <p className="msg-preview">
                  {msg.content.substring(0, 45)}...
                </p>
              </div>
            ))}
        </div>

        {/* ΔΕΞΙΑ: ΛΕΠΤΟΜΕΡΕΙΕΣ */}
        <div className="message-detail">
          {selectedMessage ? (
            <div className="detail-content">
              <div className="detail-header">
                <h3>Message from {selectedMessage.sender_name}</h3>
                <span className="detail-date">
                  <FontAwesomeIcon icon={faCalendarAlt} /> {selectedMessage.sent_at}
                </span>
              </div>
              
              <div className="property-ref-badge">
                 Interested in: <strong>{selectedMessage.property_city}, {selectedMessage.property_area}</strong>
              </div>

              <div className="sender-info">
                <p><FontAwesomeIcon icon={faUser} /> <strong>Email:</strong> {selectedMessage.sender_email}</p>
                {selectedMessage.sender_phone && (
                   <p><strong>Phone:</strong> {selectedMessage.sender_phone}</p>
                )}
              </div>

              <hr />
              
              <div className="full-message-body">
                {selectedMessage.content}
              </div>

            </div>
          ) : (
            <div className="empty-selection">
              <FontAwesomeIcon icon={faEnvelopeOpenText} className="empty-icon" />
              <p>Επιλέξτε ένα μήνυμα για ανάγνωση</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}