import PictureBook from '../models/PictureBook.js';

export const getAllPictureBooks = async (req, res) => {
  try {
    const { page = 1, limit = 12, ageRange, theme, search, sort = 'createdAt' } = req.query;

    const query = { isPublished: true };

    // Filter by age range
    if (ageRange) {
      query.ageRange = ageRange;
    }

    // Filter by theme
    if (theme) {
      query.theme = theme;
    }

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOptions = {};
    switch (sort) {
      case 'views':
        sortOptions = { views: -1 };
        break;
      case 'likes':
        sortOptions = { likes: -1 };
        break;
      case 'createdAt':
      default:
        sortOptions = { createdAt: -1 };
    }

    const picturebooks = await PictureBook.find(query)
      .select('title author coverImage ageRange theme views likes description')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await PictureBook.countDocuments(query);

    res.json({
      success: true,
      picturebooks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPictureBookById = async (req, res) => {
  try {
    const picturebook = await PictureBook.findById(req.params.id);

    if (!picturebook) {
      return res.status(404).json({ message: 'Picture book not found' });
    }

    res.json({
      success: true,
      picturebook
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPictureBook = async (req, res) => {
  try {
    const { title, author, illustrator, description, ageRange, theme, pages } = req.body;
    
    console.log('Received data:', { title, author, illustrator, description, ageRange, theme });
    console.log('Files:', req.files);
    
    // Validate cover image
    if (!req.files || !req.files['coverImage'] || !req.files['coverImage'][0]) {
      return res.status(400).json({ message: 'Cover image is required' });
    }
    
    // Handle cover image
    const coverImagePath = `/uploads/${req.files['coverImage'][0].filename}`;

    // Parse pages data
    let pagesData = [];
    if (pages) {
      try {
        pagesData = JSON.parse(pages);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid pages data format' });
      }
    }

    // Map uploaded page images to pages data
    if (req.files && req.files['pages'] && req.files['pages'].length > 0) {
      const pageImages = req.files['pages'];
      pagesData = pagesData.map((page, index) => ({
        pageNumber: index + 1,
        id: page.id || `page-${index}`,
        imageUrl: pageImages[index] ? `/uploads/${pageImages[index].filename}` : page.imageUrl,
        text: page.text || '',
        audioUrl: page.audioUrl
      }));
    }

    console.log('Pages data:', pagesData);

    const picturebook = await PictureBook.create({
      title,
      author,
      illustrator: illustrator || '',
      description: description || '',
      coverImage: coverImagePath,
      ageRange: [ageRange], // Convert to array
      theme: [theme], // Convert to array
      pages: pagesData,
      isPublished: true,
      views: 0,
      likes: 0
    });

    res.status(201).json({
      success: true,
      picturebook
    });
  } catch (error) {
    console.error('Error creating picture book:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePictureBook = async (req, res) => {
  try {
    const picturebook = await PictureBook.findById(req.params.id);

    if (!picturebook) {
      return res.status(404).json({ message: 'Picture book not found' });
    }

    // Update basic fields
    const { title, author, illustrator, description, ageRange, theme, pages } = req.body;
    if (title) picturebook.title = title;
    if (author) picturebook.author = author;
    if (illustrator !== undefined) picturebook.illustrator = illustrator;
    if (description !== undefined) picturebook.description = description;
    if (ageRange) picturebook.ageRange = [ageRange]; // Convert to array
    if (theme) picturebook.theme = [theme]; // Convert to array

    // Handle cover image update
    if (req.files && req.files['coverImage'] && req.files['coverImage'][0]) {
      picturebook.coverImage = `/uploads/${req.files['coverImage'][0].filename}`;
    }

    // Handle pages update
    if (pages) {
      try {
        const pagesData = JSON.parse(pages);
        
        if (req.files && req.files['pages'] && req.files['pages'].length > 0) {
          const pageImages = req.files['pages'];
          picturebook.pages = pagesData.map((page, index) => ({
            pageNumber: index + 1,
            id: page.id || `page-${index}`,
            imageUrl: pageImages[index] ? `/uploads/${pageImages[index].filename}` : page.imageUrl,
            text: page.text || '',
            audioUrl: page.audioUrl
          }));
        } else {
          picturebook.pages = pagesData.map((page, index) => ({
            ...page,
            pageNumber: page.pageNumber || index + 1
          }));
        }
      } catch (e) {
        return res.status(400).json({ message: 'Invalid pages data format' });
      }
    }

    await picturebook.save();

    res.json({
      success: true,
      picturebook
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePictureBook = async (req, res) => {
  try {
    const picturebook = await PictureBook.findById(req.params.id);

    if (!picturebook) {
      return res.status(404).json({ message: 'Picture book not found' });
    }

    await picturebook.deleteOne();

    res.json({
      success: true,
      message: 'Picture book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const incrementViews = async (req, res) => {
  try {
    const picturebook = await PictureBook.findById(req.params.id);

    if (!picturebook) {
      return res.status(404).json({ message: 'Picture book not found' });
    }

    picturebook.views += 1;
    await picturebook.save();

    res.json({
      success: true,
      views: picturebook.views
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};