const AdModel = require('../models/adModel.js');
const QuestionModel = require('../models/questionModel.js');

// Create a new ad
const createAd = async function (req, res, next) {
  try {
    const { title, description, price, images, activationDate, expirationDate } = req.body;

    const ad = new AdModel({
      title,
      description,
      price,
      images,
      activationDate,
      expirationDate,
      owner: req.user._id,
    });

    const createdAd = await ad.save();
    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      ad: createdAd,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get all active ads
const getAds = async function (req, res, next) {
  try {
    const now = new Date();
    const ads = await AdModel.find({
      status: 'active',
      activationDate: { $lte: now },
      expirationDate: { $gte: now },
    });

    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get ad by ID (with questions)
const getAdById = async function (req, res, next) {
  try {
    const ad = await AdModel.findById(req.params.id).populate('questions');

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Update ad (owned by logged-in user)
const updateAd = async function (req, res, next) {
  try {
    const { title, description, price, images, activationDate, expirationDate } = req.body;
    const ad = await AdModel.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to edit this ad' });
    }

    ad.title = title || ad.title;
    ad.description = description || ad.description;
    ad.price = price || ad.price;
    ad.images = images || ad.images;
    ad.activationDate = activationDate || ad.activationDate;
    ad.expirationDate = expirationDate || ad.expirationDate;

    const updatedAd = await ad.save();
    res.status(200).json({
      success: true,
      message: 'Ad updated successfully',
      ad: updatedAd,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Disable or expire an ad
const disableAd = async function (req, res, next) {
  try {
    const ad = await AdModel.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    if (ad.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to edit this ad' });
    }

    const newStatus = req.body.status;
    if (['inactive', 'expired'].includes(newStatus)) {
      ad.status = newStatus;
      const updatedAd = await ad.save();
      res.status(200).json({
        success: true,
        message: `Ad status updated to ${newStatus}`,
        ad: updatedAd,
      });
    } else {
      res.status(400).json({ message: "Invalid status. Must be 'inactive' or 'expired'." });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Ask a question
const askQuestion = async function (req, res, next) {
  try {
    const { text } = req.body;
    const adId = req.params.id;

    if (!text) {
      return res.status(400).json({ message: 'Question text is required' });
    }

    const ad = await AdModel.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const question = new QuestionModel({
      text,
      ad: adId,
    });

    const createdQuestion = await question.save();

    ad.questions.push(createdQuestion._id);
    await ad.save();

    res.status(201).json({
      success: true,
      message: 'Question submitted successfully.',
      question: createdQuestion,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Export all functions
module.exports = {
  createAd,
  getAds,
  getAdById,
  updateAd,
  disableAd,
  askQuestion,
};
