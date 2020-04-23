const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
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
  if (mongoose.models.User) {
    return mongoose.model('User');
  }
  return mongoose.model('User', UserSchema);
};

module.exports = getModel();
