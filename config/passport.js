const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../server/models/User');

module.exports = function (passport) {
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => { // authenticate로 호출됨. email과 password를 이용
    User.findOne({email: email}).then(user => { //User에서 이메일 검색
      if (!user) {
        // console.log('User not found!');
        return done(null, false, { message : '존재하지 않는 이메일 입니다.' }); //존재하지 않을 경우 오류 메시지 반환
      }
      bcrypt.compare(password, user.password, (err, isMatch) => { // 비밀번호는 bcrypt로 인해 hash 암호화 되어있으므로 .compare를 사용해서 비교
        if (err) throw err;
        if (isMatch) { // 일치하면 성공
          return done(null, user);
        } else {
          // console.log('Password incorrect!');
          return done(null, false, { message : '비밀번호가 틀립니다.' } ); // 일치하지 않으면 오류 메시지 반환
        }
      });
    });
  }));

  //User의 id만 req.session에 저장, 로그인 시에 한 번만 실행. 
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //serializeUser로 인해 req.session에 저장된 id를 UserDB에서 조회하여 조회된 결과를 req.user에 담는다. req.user를 통해 로그인된 사용자의 정보를 이용가능. 페이지를 이동할 때마다 호출. 
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
      // console.log(user);
    });
  });

}
