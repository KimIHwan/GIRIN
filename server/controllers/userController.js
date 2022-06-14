const User = require('../models/User');
const passport = require('passport');
require('../../config/passport')(passport);
const Game = require('../models/Game');

//GET 회원가입
exports.signup = async(req, res) => {
    try{
        res.render('signup');
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

//post 회원가입
exports.signupPost = async(req, res) => {
    try{
        const dup = await User.findOne({email: req.body.email})
        if(dup)
        {
            res.send("<script>alert('이미 가입된 이메일 입니다.');history.back();</script>");
        }
        else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    phno: req.body.phno,
                    admin: false
                });
                await newUser.save();
                res.send("<script>alert('회원가입에 성공하였습니다!');location.href='/login';</script>");
        }
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

exports.login = async(req, res) => {
    try{
        var fmsg = req.flash(); // 
        console.log(fmsg);
        res.render('login', {fmsg});

    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

exports.loginPost = (req, res, next) => {

    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login', 
      failureFlash: true
    })(req, res, next);
};


exports.logout = (req, res, next) => {
    req.logout((err)=> {
      if (err) { return next(err); }
      res.redirect('/login');
    });
};



exports.mypage = async(req, res) => {
    try {
        let log = req.user._id;
        let user = await User.find( {_id: log} ); // 로그인 중인 사용자 정보 검색
        let game = await Game.find( {author: log} ); // 로그인 중인 사용자가 작성한 글을 검색
        let member = await User.find({}); // 어드민의 회원관리
        console.log(member);
        console.log(game);
        res.render('mypage', {title: 'GIRIN - 마이페이지', game, user, member});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
 }

 
exports.editUser = async(req, res) => {
    try {
        if(req.user){
            if(!req.user.admin){ // 어드민은 접근 불가
                let userId = req.user._id; //로그인 중인 
                let user = await User.find( {_id: userId} );
                res.render('editUser', {title: 'GIRIN - 회원정보 수정', user });
            }
            else{
                res.send("<script>alert('잘못된 접근입니다.');location.href='/';</script>");
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>");
        }
    } catch (error) {
        console.log(`Error fetching game by ID: ${error.message}`);
    }
}

exports.updateUser = async(req, res) => {
    try {
        const getUserParams = body => {
            return {
                name: body.name,
                phno: body.phno
            };
        };
        let userId = req.user._id
        const userParams = getUserParams(req.body);

        await User.findByIdAndUpdate(userId, {$set: userParams})
        res.send("<script>alert('회원 정보가 수정되었습니다.');location.href='/mypage';</script>");

    } catch (error) {
        console.log(`Error updating user by ID: ${error.message}`);
    }

}



 exports.deleteUser = async(req, res) => {
    try {
        if(req.user){ // 로그인 중
            if(!req.user.admin){
                const loginUserId = req.user._id; //로그인 중인 사용자 아이디

                await User.findByIdAndRemove(loginUserId)
                res.send("<script>alert('회원탈퇴 되었습니다.');location.href='/';</script>");
            } else {
                res.send("<script>alert('잘못된 접근입니다.');location.href='/';</script>");
            }
            

        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>");
        }
    } catch (error) {
        console.log(`Error deleting game by ID: ${error.message}`);
    }
}


exports.deleteMember = async(req, res) => {
    try {
        if(req.user){ // 로그인 중
            if(req.user.admin){ // 어드민만
                const MemberId = req.params.id; 
                await User.findByIdAndRemove(MemberId)
                res.send("<script>alert('회원탈퇴 시켰습니다.');location.href='/mypage';</script>");
            } else {
                res.send("<script>alert('잘못된 접근입니다.');location.href='/';</script>");
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>");
        }
    } catch (error) {
        console.log(`Error deleting game by ID: ${error.message}`);
    }
}
