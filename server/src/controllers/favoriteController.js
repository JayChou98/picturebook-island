import Favorite from '../models/Favorite.js';
import User from '../models/User.js';
import PictureBook from '../models/PictureBook.js';

export const addFavorite = async (req, res) => {
  try {
    const { picturebookId } = req.body; // Changed from req.params to req.body
    const userId = req.user._id;

    // Check if picturebook exists
    const picturebook = await PictureBook.findById(picturebookId);
    if (!picturebook) {
      return res.status(404).json({ message: 'Picture book not found' });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, picturebookId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    // Create favorite
    await Favorite.create({ userId, picturebookId });

    // Add to user's favorites array
    await User.findByIdAndUpdate(userId, {
      $push: { favorites: picturebookId }
    });

    // Increment likes count
    picturebook.likes += 1;
    await picturebook.save();

    res.status(201).json({
      success: true,
      message: 'Added to favorites'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { picturebookId } = req.params;
    const userId = req.user._id;

    // Remove favorite
    await Favorite.findOneAndDelete({ userId, picturebookId });

    // Remove from user's favorites array
    await User.findByIdAndUpdate(userId, {
      $pull: { favorites: picturebookId }
    });

    // Decrement likes count
    const picturebook = await PictureBook.findById(picturebookId);
    if (picturebook && picturebook.likes > 0) {
      picturebook.likes -= 1;
      await picturebook.save();
    }

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 12 } = req.query;

    const favorites = await Favorite.find({ userId })
      .populate('picturebookId', 'title author coverImage ageRange theme views likes')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Favorite.countDocuments({ userId });

    res.json({
      success: true,
      favorites: favorites.map(f => f.picturebookId),
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkFavorite = async (req, res) => {
  try {
    const { picturebookId } = req.params;
    const userId = req.user._id;

    const favorite = await Favorite.findOne({ userId, picturebookId });

    res.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};