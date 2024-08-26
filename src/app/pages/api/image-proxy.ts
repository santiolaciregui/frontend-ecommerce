// pages/api/image-proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid URL parameter' });
    }

    try {
        // Fetch the image from the backend
        const response = await axios.get(`http://localhost:8002${url}`, {
            responseType: 'arraybuffer',
        });

        // Set the correct content type
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        // Send the image back to the client
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching image' });
    }
}
