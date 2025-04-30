import mongoose from 'mongoose';

const valuationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  listingType: {
    type: String,
    enum: ['Sell', 'Rent'],
    default: 'Sell',
  },
  propertyAddress: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Valuation = mongoose.models.Valuation || mongoose.model('Valuation', valuationSchema); 