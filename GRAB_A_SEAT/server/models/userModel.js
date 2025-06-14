const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'owner', 'super_admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'rejected'],
      default: function() {
        return this.role === 'admin' ? 'pending' : 'active';
      }
    },
    profilePic: {
      type: String,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);