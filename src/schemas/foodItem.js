const mongoose = require('mongoose');

const FoodItem = new mongoose.model('food_items', mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    cuisine: String,
    labels: [String],
    chosenDates: [Date]
}, { timestamps: true }));

module.exports = FoodItem;