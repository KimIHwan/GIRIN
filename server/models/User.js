const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    name: { // 이름
        type: String,
        required: true
    },
    email: { // email
        type: String,
        required: true,
        unique: true
    },
    password: { // 비밀번호
        type: String,
        required: true
    },
    phno: { // 핸드폰 번호
        type: String,
        required: true
    },
    admin: { // 어드민 여부
        type: Boolean
    }
});

//비밀번호 암호화
userSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else{
        next()
    }
})

module.exports = mongoose.model('User', userSchema); // 컬렉션이름은 소문자 복수형이므로 users로 생성됨