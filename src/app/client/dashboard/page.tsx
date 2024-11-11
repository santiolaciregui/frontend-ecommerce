'use client'
import React, { useState } from 'react';
import orderService from '../../pages/api/order';

interface Order {
  id: number;
  orderNumber: string;
  email: string;
  totalAmount: number;
  createdAt: string;
  OrderItems: {
    id: number;
    productName: string;
    quantity: number;
    totalPrice: number;
  }[];
}

const ClientDashboard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fetchedOrders = await orderService.fetchOrdersByEmailAndNumber(email, orderNumber);
      setOrders(fetchedOrders);
    } catch (err) {
      setError('Error fetching orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-md">
        <h1 className="text-3xl font-semibold mb-8">Client Dashboard</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Search Orders
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
                <p>Email: {order.email}</p>
                <p>Total Amount: ${order.totalAmount}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <h3 className="mt-4 font-semibold">Items:</h3>
                <ul>
                  {order.OrderItems.map(item => (
                    <li key={item.id}>
                      {item.productName} - {item.quantity} x ${item.totalPrice}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard; 