import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  childAge: {
    type: String,
    enum: ['0-3', '3-6', '6-9'],
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PictureBook'
  }],
  readingHistory: [{
    picturebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PictureBook'
    },
    lastPage: Number,
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);