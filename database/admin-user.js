const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'restricted'], required: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

const getModel = () => {
  if (mongoose.models.AdminUser) {
    return mongoose.model('AdminUser');
  }
  return mongoose.model('AdminUser', AdminUserSchema);
};

module.exports = getModel();
