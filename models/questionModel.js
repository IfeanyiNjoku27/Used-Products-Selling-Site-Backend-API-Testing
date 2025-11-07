const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        //Answer field. Null until owner replies
        answer: {
            type: String,
            default: null,
        },
        //Link to add this question is for
        ad: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Ad',
        },
        answeredAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true //CreatedAt will serve as askedAt
    }
);

module.exports = mongoose.model("Question", QuestionSchema);