const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    source: {
        type: String,
        required: true //what is yours money source
    },
    icon: {
        type: String,
    },
    amount: {
        type: Number,
        required: true //how much money you get from this source
    },
    date: {
        type: Date,
        default: Date.now //when you get this money
    },
},{timestamps: true} //when you create this income source}
);

module.exports = mongoose.model('Income', incomeSchema);