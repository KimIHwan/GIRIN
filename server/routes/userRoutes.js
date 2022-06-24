const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const methodOverride = require("method-override");

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');
}; // 로그인 중인가 판단하여 로그인 상태가 아니라면 로그인 창으로 이동하게 함

router.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
); // HTML은 PUT과 DELETE를 지원하지 않기 때문에 가짜로 만들어서 사용

router.get('/login', userController.login); // 로그인 페이지
router.post('/login', userController.loginPost); // 로그인 버튼 누르면 작동
router.get('/signup', userController.signup); // 회원가입 페이지
router.post('/signup', userController.signupPost); // 회원가입 버튼 클릭시 작동
router.get('/logout',isAuthenticated, userController.logout); // 로그아웃 클릭 시 작동. 로그인 상태가 아니면 로그인 창으로
router.get('/mypage',isAuthenticated, userController.mypage); // 마이페이지. 로그인 상태가 아니면 로그인 창으로
router.get('/mypage/editUser',isAuthenticated, userController.editUser); // 회원 정보 수정 페이지. 로그인 상태가 아니면 로그인 창으로
router.put('/mypage/update',isAuthenticated, userController.updateUser); // 수정 버튼 클릭 시. 로그인 상태가 아니면 로그인 창으로
router.delete('/mypage/delete',isAuthenticated, userController.deleteUser); // 회원 탈퇴. 로그인 상태가 아니면 로그인 창으로

router.get('/mypage/:id/editUser',isAuthenticated, userController.editMember); // 어드민의 일반 유저 회원 정보 수정 기능. 로그인 상태가 아니면 로그인 창으로
router.put('/mypage/:id/update',isAuthenticated, userController.updateMember); // 수정 버튼 클릭 시. 로그인 상태가 아니면 로그인 창으로
router.delete('/mypage/:id/delete',isAuthenticated, userController.deleteMember); // 어드민의 일반 유저 회원 탈퇴 시키기 기능. 로그인 상태가 아니면 로그인 창으로




module.exports = router;