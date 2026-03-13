import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const picturebookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  illustrator: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    required: true
  },
  ageRange: [{
    type: String,
    enum: ['0-3', '3-6', '6-9']
  }],
  theme: [{
    type: String,
    enum: ['动物', '自然', '成长', '冒险', '友谊', '科普', '传统文化']
  }],
  pages: [pageSchema],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
picturebookSchema.index({ title: 'text', description: 'text', author: 'text' });
picturebookSchema.index({ ageRange: 1 });
picturebookSchema.index({ theme: 1 });
picturebookSchema.index({ createdAt: -1 });

export default mongoose.model('PictureBook', picturebookSchema);