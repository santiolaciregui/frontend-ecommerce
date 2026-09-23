import { googleMapsUrl } from '../utils/googleMaps';

const StoreCard = ({ store, isSelected, onSelect }: { store: any, isSelected: any, onSelect: any }) => (
    <div
      className={`p-4 border rounded-md flex items-center space-x-4 cursor-pointer ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white'
      }`}
      onClick={() => onSelect(store.id?.toString() || '')}
    >
      <div className="text-2xl">
        <i className={`fa${isSelected ? 's' : 'r'} fa-circle${isSelected ? '-check' : ''} text-${isSelected ? 'blue' : 'gray'}-500`}></i>
      </div>
      <div>
        <h4 className="text-sm font-medium">{store.name}</h4>
        <a href={googleMapsUrl(store.address, store.city, store.state)} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="text-xs text-gray-500 hover:underline">{store.address} - {store.city}, {store.state}</a>
      </div>
    </div>
  );

  export default StoreCard;
