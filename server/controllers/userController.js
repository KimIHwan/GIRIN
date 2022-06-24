const User = require('../models/User');
const passport = require('passport');
require('../../config/passport')(passport);
const Game = require('../models/Game');

//GET /signup
// 회원가입
exports.signup = async(req, res) => {
    try{
        res.render('signup'); // signup.ejs 렌더링
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// POST /signup
// 회원가입
exports.signupPost = async(req, res) => {
    try{
        const dup = await User.findOne({email: req.body.email}) // 이메일 중복 확인을 위해 body에 입력된 email을 users 컬렉션에 검색
        if(dup) // 검색 결과가 있으면
        {
            res.send("<script>alert('이미 가입된 이메일 입니다.');history.back();</script>"); // 거절 알림과 뒤로가기
        }
        else { // 검색 결과가 없으면
                const newUser = new User({ // 새 유저 생성
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    phno: req.body.phno,
                    admin: false // 어드민은 무조건 false
                });
                await newUser.save(); // users 컬렉션에 저장
                res.send("<script>alert('회원가입에 성공하였습니다!');location.href='/login';</script>"); // 성공 알림
        }
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET /login
// 로그인
exports.login = async(req, res) => {
    try{
        var fmsg = req.flash(); // 로그인 실패 flash 메시지
        res.render('login', {fmsg}); // login.ejs 렌더링
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// POST /login
// 로그인
exports.loginPost = (req, res, next) => {
    passport.authenticate('local', { // authenticate로 passport의 use 호출하여 로그인 기능 구현 
      successRedirect: '/', // 성공 시 홈페이지로
      failureRedirect: '/login', // 실패 시 다시 로그인 페이지로
      failureFlash: true // flash 메시지를 위해 설정
    })(req, res, next);
};

// GET /logout
// 로그아웃
exports.logout = (req, res, next) => {
    req.logout((err)=> { // passport의 logout() 사용
      if (err) { return next(err); }
      res.redirect('/login'); // logout후 로그인 페이지로 이동
    });
};

// GET /mypage
// 마이페이지
exports.mypage = async(req, res) => {
    try {
        let log = req.user._id; // 현재 로그인 되어있는 사용자의 _id
        let user = await User.find( {_id: log} ); // 로그인 중인 사용자 정보 검색
        let game = await Game.find( {author: log} ); // 로그인 중인 사용자가 작성한 글을 검색
        let member = await User.find({}); // 유저 전체 관리(어드민 판단은 ejs에서)
        res.render('mypage', {title: 'GIRIN - 마이페이지', game, user, member}); // mypage.ejs 렌더링
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET /mypage/editUser
// 회원 정보 수정
exports.editUser = async(req, res) => {
    try {
        if(req.user){ // 로그인 중일 때
            if(!req.user.admin){ // 어드민은 접근 불가(어드민은 '자신의' 정보 수정이 필요없기에 ejs에서도 어드민은 해당 버튼이 보이지 않게 설정)
                let userId = req.user._id; //로그인 중인 사용자의 _id
                let admin = req.user.admin; // ejs에서 admin 여부를 판단하는데(어드민의 일반 유저 수정을 위해) admin 값을 보내지 않으면 오류가 발생하기 때문에 일부러 선언
                let user = await User.find( {_id: userId} ); // 수정할 유저 검색
                res.render('editUser', {title: 'GIRIN - 회원정보 수정', user , admin}); // editUser.ejs 렌더링
            }
            else{
                res.send("<script>alert('잘못된 접근입니다.');location.href='/';</script>"); // 어드민이면 접근 불가 알림
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>"); // 로그인 상태가 아닌 경우 알림
        }
    } catch (error) {
        console.log(`Error fetching user by ID: ${error.message}`);
    }
}

// PUT /mypage/update
// 회원 정보 수정
exports.updateUser = async(req, res) => {
    try {
        const getUserParams = body => { // editUser.ejs에 입력된 값을 불러옴 
            return {
                name: body.name,
                phno: body.phno
            };
        };
        let userId = req.user._id // 현재 로그인 중인 사용자의 _id
        const userParams = getUserParams(req.body); // getUserParams의 body
        await User.findByIdAndUpdate(userId, {$set: userParams}) // 로그인 중인 사용자의 _id를 users 컬렉션에 검색하여 해당하는 document에 userParams를 업데이트
        res.send("<script>alert('회원 정보가 수정되었습니다.');location.href='/mypage';</script>"); // 알림 후 마이페이지로
    } catch (error) {
        console.log(`Error updating user by ID: ${error.message}`);
    }
}

// DELETE /mypage/delete
// 회원 탈퇴
 exports.deleteUser = async(req, res) => {
    try {
        if(req.user){ // 로그인 중
            if(!req.user.admin){ // 어드민이 아닌 경우 (어드민은 탈퇴 할 이유가 없다.)
                const loginUserId = req.user._id; //로그인 중인 사용자의 _id
                await User.findByIdAndRemove(loginUserId) //로그인 중인 사용자의 _id를 users 컬렉션에 검색하여 해당 document를 삭제
                res.send("<script>alert('회원탈퇴 되었습니다.');location.href='/';</script>"); // 삭제 알림 후 홈페이지로
            } else {
                res.send("<script>alert('잘못된 접근입니다.');location.href='/';</script>"); // 어드민은 삭제 불가능
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>"); // 로그인 중이 아닐 경우
        }
    } catch (error) {
        console.log(`Error deleting user by ID: ${error.message}`);
    }
}

// DELETE /mypage/:id/delete
// 어드민의 일반 회원 탈퇴 시키기
exports.deleteMember = async(req, res) => {
    try {
        if(req.user){ // 로그인 중
            if(req.user.admin){ // 어드민만
                const MemberId = req.params.id; // 해당 회원의 _id(params로 불러오게 하기 위하여 /mypage/:id/delete 사용)
                await User.findByIdAndRemove(MemberId) // 해당 회원의 _id를 users 컬렉션에 검색하여 해당 document를 삭제
                res.send("<script>alert('회원탈퇴 시켰습니다.');location.href='/mypage';</script>"); // 삭제 알림 후 다시 마이페이지로
            } else {
                res.send("<script>alert('잘못된 접근입니다.');location.href='/';</script>"); // 어드민이 아니면 접근 불가능
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>"); // 로그인 중이 아닐 경우
        }
    } catch (error) {
        console.log(`Error deleting user by ID: ${error.message}`);
    }
}

// GET /mypage/:id/editUser
// 어드민의 일반 회원 정보 수정
exports.editMember = async(req, res) => {
    try {
        if(req.user){ // 로그인 중일 때
            if(req.user.admin){ // 어드민만
                const UserId = req.params.id; // 해당 회원의 _id(params로 불러오게 하기 위하여 /mypage/:id/editUser 사용)
                let user = await User.find( {_id: UserId} ); // 해당 회원의 _id를 users 컬렉션에 검색
                let admin = await req.user.admin // 로그인 중인 회원의 어드민 상태
                res.render('editUser', {title: 'GIRIN - 회원정보 수정', user , admin}); // editUser.ejs 렌더링(editUser.ejs에 어드민일 때와 아닐 때 action에 ':id'의 여부에서 차이를 뒀다.)
            }
            else{
                res.send("<script>alert('잘못된 접근입니다.');location.href='/';</script>"); // 어드민이 아니면 접근 불가능
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>"); // 로그인 중이 아닐 경우
        }
    } catch (error) {
        console.log(`Error fetching user by ID: ${error.message}`);
    }
}

// PUT /mypage/:id/update
// 어드민의 일반 회원 정보 수정
exports.updateMember = async(req, res) => {
    try {
        const UserId = req.params.id; // 해당 회원의 _id
        const getUserParams = body => { // editUser.ejs에 입력된 값을 불러옴
            return {
                name: body.name,
                phno: body.phno
            };
        };
        const userParams = getUserParams(req.body); // getUserParams의 body
        await User.findByIdAndUpdate(UserId, {$set: userParams}) // 해당 유저의 _id를 users 컬렉션에 검색하여 userParams의 내용으로 업데이트
        res.send("<script>alert('해당 회원의 회원 정보가 수정되었습니다.');location.href='/mypage';</script>"); // 수정 되면 알림 후 마이페이지로 이동
    } catch (error) {
        console.log(`Error updating user by ID: ${error.message}`);
    }
}