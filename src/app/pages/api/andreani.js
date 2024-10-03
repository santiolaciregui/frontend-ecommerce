import axios from 'axios';

export const fetchShippingCost = async (codigoPostalDestino) => {
  const url = `https://cotizador-api.andreani.com/api/v1/Cotizar`; // Reemplaza esto con el endpoint correcto
  const headers = {
    'Xapikey': 'TEST_XqPMiwXzTRKHH0mF3gmtPtQt3LNGIuqCTdgaUHINMdmlaFid0x9MzlYTKXPxluYQ',
    'Content-Type': 'application/json',
    'Host': 'https://pymes.andreani.com'
  };

  const requestBody = {
    "usuarioId": null,
    "tipoDeEnvioId": "9c16612c-a916-48cf-9fbb-dbad2b097e9e",
    "codigoPostalOrigen": "8000",
    "codigoPostalDestino": codigoPostalDestino, // El código postal de destino que envías desde el frontend
    "bultos": [
      {
        "itemId": "14317f1a-9818-4352-8d8b-8250d5981abc",
        "altoCm": "1",
        "anchoCm": "1",
        "largoCm": "1",
        "peso": "50",
        "unidad": "kg",
        "valorDeclarado": "1000000"
      }
    ]
  };

  try {
    const response = await axios.post(url, requestBody, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping cost:', error);
    throw error;
  }
};
