'use client';
import React, { useState, useEffect } from 'react';
import apiService from "../../pages/api/promotions";
import { Promotion } from '@/app/context/types';
import Link from 'next/link';

const PromotionAdminList = () => { 
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [formData, setFormData] = useState<Promotion>({
    id: 0,
    name: '',
    credit_card_id: 0,
    installments: 0,
    start_date: '',
    end_date: '',
  });
  const [editMode, setEditMode] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const fetchedPromotions = await apiService.fetchPromotions();
        setPromotions(fetchedPromotions);
      } catch (err) {
        setError('Error fetching promotions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleEdit = (promotion: Promotion) => {
    setFormData(promotion);
    setEditMode(true);
  };

  const handleDelete = async (promotionId: number) => {
    try {
      setLoading(true);
      await apiService.deletePromotion({id: promotionId});
      alert('Promoción eliminada con éxito');
      const fetchedPromotions = await apiService.fetchPromotions();
      setPromotions(fetchedPromotions);
    } catch (err) {
      setError('Error al eliminar la promoción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto mt-10">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Lista de Promociones</h2>
          <Link
            href="/admin/promotions/create"
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            <i className="fas fa-plus mr-2"></i>
            Añadir promoción
          </Link>
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-4 border-b">Nombre</th>
              <th className="px-6 py-4 border-b">Fecha de inicio</th>
              <th className="px-6 py-4 border-b">Fecha de fin</th>
              <th className="px-6 py-4 border-b">Tarjetas</th>
              <th className="px-6 py-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {promotions.length > 0 ? (
              promotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td className="px-6 py-4 border-b">{promotion.name}</td>
                  <td className="px-6 py-4 border-b">{promotion.start_date}</td>
                  <td className="px-6 py-4 border-b">{promotion.end_date}</td>
                  <td className="px-6 py-4 border-b">{promotion.credit_card_id}</td>
                  <td className="px-6 py-4 flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(promotion)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
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
        </table>
      </div>
    </div>
  );
};

export default PromotionAdminList;
