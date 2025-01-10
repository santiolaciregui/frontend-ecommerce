import StoreCard from "./StoreCard";

const StorePickup = ({ stores, formData, handleStoreSelect }: { stores: any, formData: any, handleStoreSelect: any }) => (
    <div>
      <label className="block text-sm font-medium mb-1">
        Selecciona la tienda donde retirará sus productos
      </label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {stores.map((store: any) => (
          <StoreCard 
            key={store.id}
            store={store}
            isSelected={formData.deliveryOption.storeId === store.id?.toString()}
            onSelect={handleStoreSelect}
          />
        ))}
      </div>
    </div>
  );
  
  export default StorePickup;