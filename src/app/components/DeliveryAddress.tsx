
const DeliveryAddress = ({ formData, handleInputChange, handleAddressSelect }: { formData: any, handleInputChange: any, handleAddressSelect: any }) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1" htmlFor="address">Dirección *</label>
        <input
          id="address"
          name="address"
          type="text"
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese su dirección (Calle, Número, Piso, Departamento)"
          value={formData.deliveryOption.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="city">Ciudad *</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.deliveryOption.city}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="province">Provincia *</label>
        <input
          type="text"
          id="province"
          name="province"
          value={formData.deliveryOption.province}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="zip">CP *</label>
        <input
          type="text"
          id="zip"
          name="zip"
          value={formData.deliveryOption.zip}
          onChange={handleInputChange}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );

  export default DeliveryAddress;