import DeliveryOption from "./DeliveryOption";

const DeliveryOptions = ({ formData, setFormData, DELIVERY_OPTIONS }: { formData: any, setFormData: any, DELIVERY_OPTIONS: any }) => (
  <div className="flex items-center space-x-4">
    <DeliveryOption
      option={DELIVERY_OPTIONS.DELIVERY}
      icon="fa-truck"
      label="Envio a domicilio"
      formData={formData}
      setFormData={setFormData}
    />
    <DeliveryOption
      option={DELIVERY_OPTIONS.PICKUP}
      icon="fa-store"
      label="Retiro en tienda"
      formData={formData}
      setFormData={setFormData}
    />
  </div>
);

export default DeliveryOptions;