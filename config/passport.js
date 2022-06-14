const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../server/models/User');

module.exports = function (passport) {
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({email: email}).then(user => {
      if (!user) {
        console.log('User not found!');
        return done(null, false, { message : '존재하지 않는 이메일 입니다.' }); // error, user, message
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          console.log('Password incorrect!');
          return done(null, false, { message : '비밀번호가 틀립니다.' } );
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
      console.log(user);
    });
  });

}
