export interface BuyProperty {
  _id: string;
  propertyType: string;
  price: string;
  name: string;
  location: string;
  beds: string;
  baths: string;
  sqft: string;
  description: string;
  indoorAmenities: string[];
  outdoorAmenities: string[];
  furnishing: string;
  reference: string;
  zoneName: string;
  dldPermitNumber: string;
  images: string[];
  qrCode?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
} 