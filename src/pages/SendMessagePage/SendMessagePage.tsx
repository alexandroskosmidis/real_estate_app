import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import type { Property } from '../../components/PropertyCard/Property.types';
import { sendMessage } from '../../services/messageService';

export default function SendMessagePage() {
  const location = useLocation();
  type PropertyLocationState = { property: Property };
  const property = (location.state as PropertyLocationState).property;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!content.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await sendMessage({
        content,
        property_id: property.property_id,
      });

      alert('Message sent successfully');
      setContent('');
    } catch {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Επικοινωνία με τον ιδιοκτήτη</h2>

      <PropertyCard property={property} />

      <textarea
        placeholder="Write your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        style={{ width: '100%', marginTop: 16 }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleSend}
        disabled={loading}
        style={{ marginTop: 12 }}
      >
        {loading ? 'Sending...' : 'Send to owner'}
      </button>
    </div>
  );
}
