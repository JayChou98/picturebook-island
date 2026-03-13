import PictureBook from '../models/PictureBook.js';
import User from '../models/User.js';

export const getDailyRecommendations = async (req, res) => {
  try {
    // Get random picturebooks based on user's child age
    const user = req.user;
    let ageFilter = {};
    
    if (user && user.childAge) {
      ageFilter = { ageRange: user.childAge };
    }

    // Get popular and new picturebooks
    const popularBooks = await PictureBook.find({
      ...ageFilter,
      isPublished: true
    })
      .sort({ views: -1, likes: -1 })
      .limit(6);

    const newBooks = await PictureBook.find({
      ...ageFilter,
      isPublished: true
    })
      .sort({ createdAt: -1 })
      .limit(6);

    // Combine and deduplicate
    const allBooks = [...popularBooks, ...newBooks];
    const uniqueBooks = Array.from(new Map(allBooks.map(b => [b._id.toString(), b])).values()).slice(0, 8);

    res.json({
      success: true,
      recommendations: uniqueBooks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({
        success: true,
        recommendations: []
      });
    }

    const user = await User.findById(req.user._id).populate('favorites');

    if (!user.favorites || user.favorites.length === 0) {
      // If no favorites, return popular books for user's age group
      const books = await PictureBook.find({
        ageRange: user.childAge,
        isPublished: true
      })
        .sort({ views: -1 })
        .limit(10);

      return res.json({
        success: true,
        recommendations: books
      });
    }

    // Get themes and age ranges from favorites
    const favoriteThemes = new Set();
    const favoriteAgeRanges = new Set();

    user.favorites.forEach(book => {
      book.theme.forEach(t => favoriteThemes.add(t));
      book.ageRange.forEach(a => favoriteAgeRanges.add(a));
    });

    // Find similar books
    const recommendations = await PictureBook.find({
      _id: { $nin: user.favorites.map(f => f._id) },
      $or: [
        { theme: { $in: Array.from(favoriteThemes) } },
        { ageRange: { $in: Array.from(favoriteAgeRanges) } }
      ],
      isPublished: true
    })
      .sort({ views: -1, likes: -1 })
      .limit(10);

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};