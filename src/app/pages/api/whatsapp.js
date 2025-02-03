import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getWhatsAppQRCode = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`${API_BASE_URL}/whatsapp/qr-code`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Expected to have { qrCode: 'data:image/png;base64,...' }
  } catch (error) {
    console.error('Error fetching WhatsApp QR code:', error);
    throw error;
  }
};