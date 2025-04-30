import mongoose from 'mongoose';

const commercialPropertySchema = new mongoose.Schema({
  propertyType: {
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

export const CommercialProperty = mongoose.models.CommercialProperty || mongoose.model('CommercialProperty', commercialPropertySchema); 