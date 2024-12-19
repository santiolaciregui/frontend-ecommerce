// pages/orders.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../pages/api/order'; // Adjust the path as necessary
import { IoHome, IoCart, IoPersonOutline, IoBarChart, IoSettings } from 'react-icons/io5'; // You can use react-icons for icons
import { Order } from '../context/types';

const AdminDashboard1: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gray-100 font-sans leading-normal tracking-normal h-screen flex">
      {/* Sidebar */}
      <aside className="bg-white w-64 p-4 border-r overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <IoHome className="text-xl" />
                <span>Home</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <IoCart className="text-xl" />
                <span>Products</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <IoPersonOutline className="text-xl" />
                <span>Customers</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <IoBarChart className="text-xl" />
                <span>Reports</span>
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <IoSettings className="text-xl" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Recent Orders</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 border-b text-left">Order ID</th>
                <th className="py-3 px-4 border-b text-left">Email</th>
                <th className="py-3 px-4 border-b text-left">Total Amount</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">#{order.id}</td>
                  <td className="py-3 px-4 border-b">{order.email}</td>
                  <td className="py-3 px-4 border-b">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`text-${order.status === 'completed' ? 'green' : order.status === 'pending' ? 'yellow' : 'red'}-500`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard1;
