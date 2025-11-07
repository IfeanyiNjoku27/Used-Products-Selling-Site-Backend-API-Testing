const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdSchema = new Schema (
    {
        title: {
            type: String,
            required: "A title is required",
            trim: true
        },
        description: {
            type: String,
            required: "A description is required"
        },
        price: {
            type: Number,
            required: "A Price is required"
        },
        images: [
            {
                type: String, //Array of image url's
            },
        ],
        //Link to user who owns ad
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        //Ad lifetime fields 
        activationDate: {
            type: Date,
            default: Date.now,
        },
        expirationDate: {
            type: Date,
            required: true,
        },
        //Status for disabling ads
        status: {
            type: String,
            enum: ['active', 'inactive', 'expired'],
            default: 'active',
        },
        //Link to all questions for ad
        question: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Questions',
            },
        ],
    },
    {
        timestamps: true //Adds createdAt and updatedAt time stamps
    }
);

const Ad = mongoose.model('Ad', AdSchema);
export default Ad;