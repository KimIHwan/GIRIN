const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    pros: {
        type: String,
        required: 'This field is required.'
    },
    cons: {
        type: String,
        required: 'This field is required.'
    },
    description: {
        type: String,
        required: 'This field is required.'
    },
    review: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.'
    },
    elements: {
        type: Array,
        required: 'This field is required.'
    },
    category: {
        type: String,
        enum: ['Adventure', 'Rhythm', 'Sports','Shooting', 'Simulation', 'Action', 'Puzzle', 'Board', 'BattleRoyale', 'Social', 'RPG', 'Platform', 'Sandbox'],
        required: 'This field is required.'
    },
    image: {
        type: String,
        required: 'This field is required.'
    },
    author: {
        type: String,
        required: 'This field is required'
    }
});

// gameSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
// gameSchema.index({ "$**" : 'text'});

module.exports = mongoose.model('Game', gameSchema);