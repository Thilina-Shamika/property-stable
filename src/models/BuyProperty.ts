import mongoose from 'mongoose';

const buyPropertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: true,
    enum: ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Studio', 'Loft']
  },
  price: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  beds: {
    type: String,
    required: true
  },
  baths: {
    type: String,
    required: true
  },
  sqft: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  indoorAmenities: [{
    type: String
  }],
  outdoorAmenities: [{
    type: String
  }],
  furnishing: {
    type: String,
    required: true,
    enum: ['Fully Furnished', 'Furnished', 'Not Furnished']
  },
  reference: {
    type: String,
    required: true
  },
  zoneName: {
    type: String,
    required: true
  },
  dldPermitNumber: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  qrCode: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

export const BuyProperty = mongoose.models.BuyProperty || mongoose.model('BuyProperty', buyPropertySchema); 