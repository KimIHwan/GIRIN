const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phno: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
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


//암호화 비교
// userSchema.methods.comparePassword = function (plainPassword, callBack){
//     bcrypt.compare(plainPassword, this.password, function(err,isMatch){
//         if(err) return callBack(err)
//         callBack(null, isMatch)
//     })
// }


module.exports = mongoose.model('User', userSchema);