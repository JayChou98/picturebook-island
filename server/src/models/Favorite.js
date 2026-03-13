import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  picturebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PictureBook',
    required: true
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, picturebookId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);