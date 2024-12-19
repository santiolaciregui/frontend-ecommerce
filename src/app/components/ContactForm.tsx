import React from 'react';

const ContactForm: React.FC<{
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">Datos de contacto</h2>
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1" htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.contactInfo.email}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="firstName">Nombre *</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.contactInfo.firstName}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="lastName">Apellido *</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.contactInfo.lastName}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1" htmlFor="phone">Teléfono *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.contactInfo.phone}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  </div>
  );
};

export default ContactForm;
