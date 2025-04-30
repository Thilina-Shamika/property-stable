import mongoose from 'mongoose';

const rentPropertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  sqft: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
  },
  zoneName: {
    type: String,
  },
  dldPermitNumber: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
  },
  qrCodeImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RentProperty = mongoose.models.RentProperty || mongoose.model('RentProperty', rentPropertySchema); 