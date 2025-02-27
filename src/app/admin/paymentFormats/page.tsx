// AdminPaymentFormats.tsx
'use client';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import paymentFormatsService from '../../pages/api/paymentFormat'
import { PaymentFormat } from '@/app/context/types';

const AdminPaymentFormats = () => {
  const [paymentFormats, setPaymentFormats] = useState<PaymentFormat[]>([]);
  const [formData, setFormData] = useState({
    paymentMethod: '',
    percentage: '',
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const data = await paymentFormatsService.fetchPaymentFormats();
      setPaymentFormats(data);
    } catch (error) {
      console.error('Error fetching payment formats:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await paymentFormatsService.updatePaymentFormat(editingId, formData);
        setEditingId(null);
      } else {
        await paymentFormatsService.createPaymentFormat(formData);
      }
      setFormData({ paymentMethod: '', percentage: '', active: true });
      fetchData();
    } catch (error) {
      console.error('Error saving payment format:', error);
    }
  };

  const handleEdit = (format: any) => {
    setEditingId(format.id);
    setFormData({
      paymentMethod: format.paymentMethod,
      percentage: format.percentage,
      active: format.active,
    });
  };

  const handleDelete = async (id : any) => {
    if (!window.confirm('¿Estás seguro de eliminar este medio de pago?')) return;
    try {
      await paymentFormatsService.deletePaymentFormat(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting payment format:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Administración de Medios de Pago</h1>

        {/* Formulario para crear/editar */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl mb-4">
            {editingId ? 'Editar Medio de Pago' : 'Crear Medio de Pago'}
          </h2>
          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block mb-2 font-medium">
              Medio de Pago
            </label>
            <input
              id="paymentMethod"
              name="paymentMethod"
              type="text"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              placeholder="Ej: Efectivo, Débito, Credito Personal, ..."
            />
          </div>
          <div className="mb-4">
            <label htmlFor="percentage" className="block mb-2 font-medium">
              Porcentaje (ej. 0.15 para 15%)
            </label>
            <input
              id="percentage"
              name="percentage"
              type="number"
              step="0.01"
              value={formData.percentage}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
              placeholder="Ej: 0.15"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="active">Activo</label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
        </form>

        {/* Tabla con la lista de medios de pago */}
        {/* Tabla con la lista de medios de pago */}
<div className="bg-white p-6 rounded shadow-md">
  <h2 className="text-xl mb-4 text-center">Lista de Medios de Pago</h2>
  {paymentFormats.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="min-w-full mx-auto divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medio de Pago
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Porcentaje
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activo
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paymentFormats.map((format) => (
            <tr key={format.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {format.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {format.paymentMethod}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {format.percentage}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {format.active ? 'Sí' : 'No'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => handleEdit(format)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(format.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-center">No hay medios de pago configurados.</p>
  )}
</div>

      </div>
    </div>
  );
};

export default AdminPaymentFormats;
