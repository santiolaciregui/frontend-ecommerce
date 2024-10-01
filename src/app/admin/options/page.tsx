'use client';

import React, { useState, useEffect } from 'react';
import apiServiceOptions from "../../pages/api/options"; // Ensure this API service exists
import { Option } from '@/app/context/types'; // Update the import as needed

interface OptionForm {
  name: string;
  type: number; // 0 for color, 1 for size
  colorCode: string;
}

const CreateOption = () => {
  const [formData, setFormData] = useState<OptionForm>({ name: '', type: 0, colorCode:'' });
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      await apiServiceOptions.createOption(formData); // Create the new option
      alert('Opción creada con éxito');

      // Refresh the options list after creating a new option
      const fetchedOptions = await apiServiceOptions.fetchOptions();
      setOptions(fetchedOptions);

      setFormData({ name: '', type: 0, colorCode:''}); // Reset form after submission
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

      {/* Displaying existing options, separated by type */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Opciones Creadas</h3>
        <div className="mb-4">
          <h4 className="text-lg font-medium">Colores:</h4>
          <ul className="list-disc pl-5">
            {options.filter(option => option.type === 0).map(option => (
              <li key={option.id} className="flex items-center">
                <span
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: option.colorCode }} // Display color as background
                />
                {option.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium">Tamaños:</h4>
          <ul className="list-disc pl-5">
            {options.filter(option => option.type === 1).map(option => (
              <li key={option.id}>{option.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateOption;
