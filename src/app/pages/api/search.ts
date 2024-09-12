import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ; 

const searchProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const backendUrl = `${API_BASE_URL}/search?query=${encodeURIComponent(query as string)}`; // Adjust backend URL/port as necessary
    const response = await axios.get(backendUrl);
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export default searchProducts;
