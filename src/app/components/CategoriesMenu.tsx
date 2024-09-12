// components/Categories.tsx
interface Category {
    name: string;
    image: string;
  }
  
  interface CategoriesProps {
    categories: Category[];
  }
  
  const CategoriesMenu: React.FC<CategoriesProps> = ({ categories }) => {
    return (
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <img src={category.image} alt={category.name} className="w-full h-48 object-cover mt-2 rounded-lg" />
          </div>
        ))}
      </div>
    );
  };
  
  export default CategoriesMenu;
  