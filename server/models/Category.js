const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { // 카테고리 이름들
        type: String,
        required: 'This field is required.'
    },
    image: { // 카테고리 사진
        type: String,
        required: 'This field is required.'
    }
});

module.exports = mongoose.model('Category', categorySchema); // 컬렉션이름은 소문자 복수형이므로 categories로 생성됨