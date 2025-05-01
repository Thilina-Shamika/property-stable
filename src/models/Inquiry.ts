import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    enum: ['Buy', 'Commercial', 'Off Plan'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  source: {
    type: String,
    required: true,
    enum: ['home', 'contact'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema); 