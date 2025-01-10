const DeliveryOption = ({ option, icon, label, formData, setFormData }: { option: any, icon: any, label: any, formData: any, setFormData: any }) => ( 
  <label className="flex items-center">
    <input
      type="radio"
      name="option"
      value={option}
      checked={formData.deliveryOption.option === option}
      onChange={(e) =>
        setFormData((prevData: any) => ({
          ...prevData,
          deliveryOption: {
            ...prevData.deliveryOption,
            option: e.target.value,
          },
        }))
      }
      className="mr-2"
    />
    <i className={`fas ${icon} mr-2`}></i>{label}
  </label>
);

export default DeliveryOption;