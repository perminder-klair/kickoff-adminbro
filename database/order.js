const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  email: { type: String },
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postal_code: { type: String },
  },
});

const OrderSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    customer: CustomerSchema,
    whatsAppNumber: { type: String, required: true }, // number bought
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true },
    stripePlanId: { type: String, required: true },
    interval: {
      type: String,
      default: 'monthly',
      enum: ['monthly', 'yearly'],
    },
    type: {
      type: String,
      default: 'mobile',
      enum: ['mobile', 'landline'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'active', 'cancelled', 'failed'],
    },
  },
  {
    strict: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const getModel = () => {
  if (mongoose.models.Order) {
    return mongoose.model('Order');
  }
  return mongoose.model('Order', OrderSchema);
};

module.exports = getModel();
