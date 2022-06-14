const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const methodOverride = require("method-override");
// const validator = require("../../middleware/validator");
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

router.get('/login', userController.login);
router.post('/login', userController.loginPost);
router.get('/signup', userController.signup);
router.post('/signup', userController.signupPost);
router.get('/logout',isAuthenticated, userController.logout);
router.get('/mypage',isAuthenticated, userController.mypage);
router.get('/mypage/editUser',isAuthenticated, userController.editUser);
router.put('/mypage/update',isAuthenticated, userController.updateUser);
router.delete('/mypage/delete',isAuthenticated, userController.deleteUser);
router.delete('/mypage/:id/delete',isAuthenticated, userController.deleteMember);


module.exports = router;