const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: { // 게임 제목
        type: String,
        required: 'This field is required.'
    },
    pros: { // 장점
        type: String,
        required: 'This field is required.'
    },
    cons: { // 단점
        type: String,
        required: 'This field is required.'
    },
    description: { // 설명
        type: String,
        required: 'This field is required.'
    },
    review: { // 소감
        type: String,
        required: 'This field is required.'
    },
    email: { // 작성자 이메일
        type: String,
        required: 'This field is required.'
    },
    elements: { // 요소
        type: Array,
        required: 'This field is required.'
    },
    category: { // 카테고리
        type: String,
        enum: ['Adventure', 'Rhythm', 'Sports','Shooting', 'Simulation', 'Action', 'Puzzle', 'Board', 'BattleRoyale', 'Social', 'RPG', 'Platform', 'Sandbox'],
        required: 'This field is required.'
    },
    image: { // 이미지
        type: String,
        required: 'This field is required.'
    },
    author: { // 작성자 _id
        type: String,
        required: 'This field is required'
    }
});

module.exports = mongoose.model('Game', gameSchema); // 컬렉션이름은 소문자 복수형이므로 games로 생성됨