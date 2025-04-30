import mongoose from 'mongoose';

const mortgageConsultingSchema = new mongoose.Schema({
  fullName: {
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
  interestedCommunities: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  downPayment: {
    type: Number,
    required: true,
  },
  loanPeriod: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
  monthlyRepayment: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.MortgageConsulting || mongoose.model('MortgageConsulting', mortgageConsultingSchema); 