const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
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

/**
 * App Routes
 */
router.get('/', gameController.homepage); // 기본 홈 페이지
router.get('/game/:id', gameController.exploreGame ); // 게임 리뷰 글 페이지
router.get('/categories', gameController.exploreCategories); // 카테고리 목록 페이지
router.get('/categories/:id', gameController.exploreCategoriesById); // 카테고리 내의 목록 페이지 (Adventure, Sports 등등), 앨범식
router.get('/categories/:id/list', gameController.exploreCategoriesByIdlist); // 카테고리 내의 목록 페이지 , 리스트식
router.post('/search', gameController.searchGame); // 게임 검색 
router.get('/explore-latest', gameController.exploreLatest); // 글 최신순으로 조회
router.get('/explore-random', gameController.exploreRandom); // 랜덤 글 하나 보여주기
router.get('/submit-game',isAuthenticated, gameController.submitGame); // 게임 리뷰 작성 페이지. 로그인 이용자만 가능
router.post('/submit-game', gameController.submitGameOnPost); // 게임 리뷰 작성 POST. 게임 등록 버튼 누르면 작동 

router.get('/game/:id/edit', gameController.editGame); // 게임 게시글 수정
router.put('/game/:id/update', gameController.updateGame); // 게임 게시글 수정 기능. 수정 완료버튼 누르면 작동
router.delete('/game/:id/delete', gameController.deleteGame); // 게임 게시글 삭제 기능



module.exports = router;