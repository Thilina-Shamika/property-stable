import mongoose from 'mongoose';

const propertyInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
  },
  propertyId: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['buy', 'rent', 'off-plan'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PropertyInquiry || mongoose.model('PropertyInquiry', propertyInquirySchema); 