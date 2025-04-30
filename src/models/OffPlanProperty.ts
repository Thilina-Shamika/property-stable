import mongoose, { Schema, models, model } from 'mongoose';

// Delete the model if it exists to prevent schema modification errors
if (mongoose.models.OffPlanProperty) {
  delete mongoose.models.OffPlanProperty;
}

const offPlanPropertySchema = new Schema({
  // Key Information
  title: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  priceRange: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    }
  },
  paymentPlan: {
    downPayment: {
      type: Number,
      default: 0
    },
    installment1: {
      type: String,
      required: true
    },
    installment2: {
      type: String,
      required: true
    }
  },
  completionDate: {
    type: String,
    default: '',
    required: false
  },
  handoverDate: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Developer Info
  developer: {
    type: String,
    required: true
  },
  
  // Project Details
  location: {
    type: String,
    required: true
  },
  
  // Regulatory Info
  projectNumber: {
    type: String,
    required: true
  },
  dldPermitNumber: {
    type: String,
    required: false
  },
  
  // Media
  mainImage: {
    type: String,
    default: ''
  },
  qrCode: {
    type: String,
    required: false
  },
  images: {
    type: [String],
    default: []
  },
  
  // Status
  status: {
    type: String,
    enum: {
      values: ['draft', 'published'],
      message: '{VALUE} is not a valid status'
    },
    default: 'draft'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamps on save
offPlanPropertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const OffPlanProperty = models.OffPlanProperty || model('OffPlanProperty', offPlanPropertySchema); 