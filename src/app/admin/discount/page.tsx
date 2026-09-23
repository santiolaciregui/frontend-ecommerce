'use client';
import React, { useState, useEffect } from 'react';
import apiServiceDiscount from "../../pages/api/discount";
import { Discount } from '@/app/context/types';
import Link from 'next/link';
import BackButton from '@/app/components/BackButton';

const DiscountAdminList = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  // Removed unused editMode and formData

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


  const handleDelete = async (discountId: number) => {
    if (!window.confirm('¿Eliminar este descuento? Los productos asociados volverán a su precio sin este descuento.')) return;
    try {
      setLoading(true);
      await apiServiceDiscount.deleteDiscountByID(discountId);
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

  const handleToggle = async (discount: Discount) => {
    try {
      setLoading(true);
      await apiServiceDiscount.updateDiscount(discount.id, { active: !discount.active });
      setDiscounts(current => current.map(item => item.id === discount.id ? { ...item, active: !item.active } : item));
    } catch (err) {
      setError('No se pudo cambiar el estado del descuento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mt-10">

        <div className="flex justify-between items-center mb-4">
        <BackButton destination="/admin" />

          <h2 className="text-2xl font-semibold">Lista de Descuentos</h2>
          <Link
            href="/admin/discount/create"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir descuento
          </Link>

        </div>

        <div className="overflow-x-auto"><table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-4 border-b">Nombre</th>
              <th className="px-6 py-4 border-b">Porcentaje</th>
              <th className="px-6 py-4 border-b">Descripción</th>
              <th className="px-6 py-4 border-b">Estado</th>
              <th className="px-6 py-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {discounts.length > 0 ? (
              discounts.map(discount => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 border-b">{discount.name}</td>
                  <td className="px-6 py-4 border-b">{discount.percentage}%</td>
                  <td className="px-6 py-4 border-b">{discount.description}</td>
                  <td className="px-6 py-4 border-b"><button disabled={loading} onClick={() => handleToggle(discount)} className="underline text-zinc-800">{discount.active ? 'Activo — desactivar' : 'Inactivo — activar'}</button></td>
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <Link
                      href={`/admin/discount/update/${discount.id}`}
                      className="text-blue-500 hover:underline mr-4"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(discount.id!)}
                      className="text-red-500 hover:underline"
                    >
                      <i className="fas fa-trash-alt mr-2"></i>

                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 text-lg"
                >
                  Aún no hay elementos
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      </div>
    </div>
  );
};

export default DiscountAdminList;
