import mongoose from 'mongoose';

// Delete the model if it exists to force recompilation
if (mongoose.models.PropertyInquiry) {
  delete mongoose.models.PropertyInquiry;
}

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
    enum: ['buy', 'rent', 'off-plan', 'commercial'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PropertyInquiry', propertyInquirySchema); 