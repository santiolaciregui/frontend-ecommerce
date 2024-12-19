import React from 'react';
import { Store } from '../context/types';
import AddressAutocomplete from './AddressAutocomplete';
import DeliveryOptions from './DeliveryOptions';
import StorePickup from './StorePickup';
import DeliveryAddress from './DeliveryAddress';
const DeliveryDetails = ({
  formData,
  setFormData,
  DELIVERY_OPTIONS,
  handleAddressSelect,
  handleInputChange,
  stores,
  handleStoreSelect,
}: {
  formData: any;
  setFormData: any;
  DELIVERY_OPTIONS: any;
  handleAddressSelect: any;
  handleInputChange: any;
  stores: any;
  handleStoreSelect: any;
}) => {
  return (
    <div className="space-y-4">
    <h2 className="text-xl font-semibold mb-4">Detalles de la entrega</h2>
    <DeliveryOptions
      formData={formData} 
      setFormData={setFormData} 
      DELIVERY_OPTIONS={DELIVERY_OPTIONS}
    />
    
    {formData.deliveryOption.option === DELIVERY_OPTIONS.DELIVERY ? (
      <DeliveryAddress
        formData={formData} 
        handleInputChange={handleInputChange}
        handleAddressSelect={handleAddressSelect}
      />
    ) : (
      <StorePickup
        stores={stores} 
        formData={formData}
        handleStoreSelect={handleStoreSelect}
      />
    )}
  </div>
  );
};

export default DeliveryDetails;
