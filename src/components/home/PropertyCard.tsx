import Image from 'next/image';

interface PropertyCardProps {
  image: string;
  name: string;
  address: string;
  developer: string;
  price: string;
  handoverDate: string;
}

const PropertyCard = ({ image, name, address, developer, price, handoverDate }: PropertyCardProps) => {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-[240px] w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{address}</p>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Developer:</span>
            <span className="text-sm text-gray-900 ml-2">{developer}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Price:</span>
            <span className="text-sm text-gray-900 ml-2">{price}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500">Handover:</span>
            <span className="text-sm text-gray-900 ml-2">{handoverDate}</span>
          </div>
        </div>

        <button className="w-full mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard; 