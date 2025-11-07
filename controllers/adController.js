import { json } from "express";
import Ad from "../models/adModel";
import AdModel from "../models/adModel";
import QuestionModel from "../models/questionModel";

//create a new ad
module.exports.create = async function (req, res, next) {
    try {
        const { title, description, price, images, activationDate, expirationDate} = 
        req.body;

        const ad = new AdModel({
            title,
            description,
            price,
            images,
            activationDate,
            expirationDate,
            owner: req.user._id, //owner is the logged in user
        });

        const createdAd = await ad.save();
        res.status(201).json({
            success: true,
            message: "Ad creted sucessfully",
            ad: createdAd
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
};

//Get all active ads
module.exports.getAll = async function (req, res, next) {
    try{
        const now = new Date();
        const ads = await AdModel.find({
            status: 'active',
            activationDate: {$lte: now},
            expirationDate: {$gte: now}
        });

        res.json(ads);

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};

//Get ad by id with questions
const getAdById = async function (req, res, next) {
    try {
        const ad = await Ad.findById(req.params._id).populate('questions');

        if (!ad) {
            return res.status(404).json({message: 'Ad not found'});
        }

        res.json(ad);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

//Update an ad (owned by logged in user)
const updateAd = async function (req, res, next) {
    try {
        const { title, description, price, images, activationDate, expirationDate } = req.body;

        let ad = await AdModel.findById(req.params._id);

        if(!ad) {
            return res.status(404).json({message: 'Ad not found'});
        }

        //Check if ad belongs to owner
        if(ad.owner.toString() !== req.user._id.toString()) {
            res.status(401).json({message: 'User not authorized to edit this ad'});
        }

        //update fields if update is allowed
        ad.title = title || ad.title;
        ad.description = description || ad.description;
        ad.price = price || ad.price;
        ad.images = images || ad.images;
        ad.activationDate = activationDate || ad.activationDate;
        ad.expirationDate = expirationDate || ad.expirationDate;

        const adResult = await ad.save();

        res.status(200).json({
            sucess: true,
            message: "Ad updated successfully",
            ad: adResult
        });

    } catch (error) {
        console.log(err);
        next(error);
    }
};

//Disable or expire an ad (no deletion)
module.exports.disable = async function (req, res, next) {
    
    try {
        let ad = await AdModel.findById(req.params._id);

        if(!ad) {
            return res.status(404).json({message: 'Ad not found'});
        }

         //Check if ad belongs to owner
        if(ad.owner.toString() !== req.user._id.toString()) {
            res.status(401).json({message: 'User not authorized to edit this ad'});
        }

        const newStatus = req.body.status;
        if (['inactive', 'expired'].includes(newStatus)) {

            ad.status = newStatus;
            const updateAd = await ad.save();
            res.status(200),json({
                sucess: true,
                message: `Ad status updated to ${newStatus}`,
                ad: updateAd    
            });

        } else {
            res.status(400);
            throw new Error("Invalid status. Must be 'inactive' or 'expired'.");
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
};

//Ask question
module.exports.askQuestion = async function (req, res, next) {
  try {
    const { text } = req.body;
    const adId = req.params.id;

    if (!text) {
      res.status(400);
      throw new Error('Question text is required');
    }

    const ad = await AdModel.findById(adId);
    if (!ad) {
      throw new Error('Ad not found');
    }

    //Create and store the question
    const question = new QuestionModel({
      text,
      ad: adId,
    });

    const createdQuestion = await question.save();

    // Link question to ad
    ad.questions.push(createdQuestion._id);
    await ad.save();

    res.status(201).json({
      success: true,
      message: 'Question submitted successfully.',
      question: createdQuestion
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

export {
    createAd,
    getAds,
    getAdById,
    updateAd,
    disableAd,
    askQuestion,
};