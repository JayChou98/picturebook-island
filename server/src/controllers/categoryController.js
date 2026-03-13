import Category from '../models/Category.js';

export const getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;

    const categories = await Category.find({ type }).sort({ order: 1 });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, type, icon, order } = req.body;

    const category = await Category.create({
      name,
      type,
      icon,
      order
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ type: 1, order: 1 });

    const ageCategories = categories.filter(c => c.type === 'age');
    const themeCategories = categories.filter(c => c.type === 'theme');

    res.json({
      success: true,
      ageCategories,
      themeCategories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};