'use client';
import React, { useState, useEffect } from 'react';
import apiServiceDiscount from "../../pages/api/discount";
import { Discount } from '@/app/context/types';
import Link from 'next/link';

const DiscountAdminList = () => { 
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [formData, setFormData] = useState<Discount>({
    id: 0,
    name: '',
    percentage: 0,
    description: '',
    active: false
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      try {
        const fetchedDiscounts = await apiServiceDiscount.fetchDiscounts();
        setDiscounts(fetchedDiscounts);
      } catch (err) {
        setError('Error fetching discounts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const handleEdit = (discount: Discount) => {
    setFormData(discount);
    setEditMode(true);
  };

  const handleDelete = async (discountId: number) => {
    try {
      setLoading(true);
      await apiServiceDiscount.deleteDiscountByID({id: discountId});
      alert('Descuento eliminado con éxito');
      const fetchedDiscounts = await apiServiceDiscount.fetchDiscounts();
      setDiscounts(fetchedDiscounts);
    } catch (err) {
      setError('Error al eliminar el descuento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mt-10">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Lista de Descuentos</h2>
          <Link 
              href='/admin/discount/create' className="w-36 text-sm rounded-2xl ring-1 ring-green-400 text-green-400 py-2 px-4 hover:bg-green-400 hover:text-white disabled:cursor-not-allowed disabled:bg-green-200"
          >
              Añadir Descuento
          </Link>
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-4 border-b">Nombre</th>
              <th className="px-6 py-4 border-b">Porcentaje</th>
              <th className="px-6 py-4 border-b">Descripción</th>
              <th className="px-6 py-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map(discount => (
              <tr key={discount.id}>
                <td className="px-6 py-4 border-b">{discount.name}</td>
                <td className="px-6 py-4 border-b">{discount.percentage}%</td>
                <td className="px-6 py-4 border-b">{discount.description}</td>
                <td className="px-6 py-4 border-b">
                  <button
                    onClick={() => handleEdit(discount)}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(discount.id!)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountAdminList;
