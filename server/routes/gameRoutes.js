const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const methodOverride = require("method-override");


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');
};

router.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
);

/**
 * App Routes
 */
router.get('/', gameController.homepage);
router.get('/game/:id', gameController.exploreGame );
router.get('/categories', gameController.exploreCategories);
router.get('/categories/:id', gameController.exploreCategoriesById);
router.post('/search', gameController.searchGame);
router.get('/explore-latest', gameController.exploreLatest);
router.get('/explore-random', gameController.exploreRandom);
router.get('/submit-game',isAuthenticated, gameController.submitGame);
router.post('/submit-game', gameController.submitGameOnPost);

router.get('/game/:id/edit', gameController.editGame);
router.put('/game/:id/update', gameController.updateGame);
router.delete('/game/:id/delete', gameController.deleteGame); // 어드민 계정으로 일반 계정 삭제



module.exports = router;