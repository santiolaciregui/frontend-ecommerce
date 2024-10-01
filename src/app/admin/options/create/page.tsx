'use client';

import React, { useState, useEffect } from 'react';
import apiServiceOptions from "../../../pages/api/options"; // Update the import path as necessary
import { Option } from '@/app/context/types';

interface OptionForm {
  name: string;
  type: number; // 0 for color, 1 for size
}

const CreateOption = () => {
  const [formData, setFormData] = useState<OptionForm>({ name: '', type: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const fetchedOptions = await apiServiceOptions.fetchOptions(); // Fetch existing options
        setOptions(fetchedOptions);
      } catch (err) {
        setError('Error fetching options');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'type' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await apiServiceOptions.createOption(formData);
      alert('Opción creada con éxito');
      setFormData({ name: '', type: 0 }); // Reset form after submission
    } catch (err) {
      setError('Error al crear la opción');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Crear Nueva Opción</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700">Nombre de la Opción</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700">Tipo de Opción</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value={0}>Color</option>
            <option value={1}>Tamaño</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Opción'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>

      {/* Displaying existing options */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Opciones Creadas</h3>
        <ul className="list-disc pl-5">
          {options.map(option => (
            <li key={option.id}>
              {option.type === 0 ? `Color: ${option.name}` : `Tamaño: ${option.name}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreateOption;
