export type Message = {
  message_id: number;
  content: string;
  sent_at: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  property_city: string;
  property_area: string;
  property_photo: string;
};

const API_URL = "https://dblab.nonrelevant.net/~lab2526omada2/backend/api/messages"; 

export const fetchMyMessages = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/get_message.php?user_id=${userId}`);
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};