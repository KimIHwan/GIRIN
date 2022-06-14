require('../models/database');
const Category = require('../models/Category');
const Game = require('../models/Game');

/**
 * GET /
 * Homepage
 */
exports.homepage = async(req, res) => {
    try{
        const limitNumber = 5;// 사이트에 보여질 개수
        const categories = await Category.find({}).limit(limitNumber); // 설정된 개수 만큼 Category find() 
        const latest = await Game.find({}).sort({_id: -1}).limit(limitNumber);
        const adventure = await Game.find({ 'category': 'Adventure' }).limit(limitNumber);
        const rhythm = await Game.find({ 'category': 'Rhythm' }).limit(limitNumber);
        const sports = await Game.find({ 'category': 'Sports' }).limit(limitNumber);

        const genre = { latest, adventure, rhythm, sports };


        res.render('index', {title: 'GIRIN - Home', categories, genre});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }

}


/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async(req, res) => {
    try{
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', {title: 'GIRIN - Categories', categories});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => {
    try{
        let categoryId = req.params.id; // Routes의 /categories/:id
        const categoryById = await Game.find({ 'category': categoryId });
        // console.log(categoryId)
        // console.log(categoryById)
        res.render('categoriesId', {title: 'GIRIN - Categories', categoryById, categoryId});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

exports.exploreCategoriesByIdlist = async(req, res) => {
    try{
        let categoryId = req.params.id; // Routes의 /categories/:id
        const categoryById = await Game.find({ 'category': categoryId });
        // console.log(categoryId)
        // console.log(categoryById)
        res.render('categoriesId_list', {title: 'GIRIN - Categories', categoryById, categoryId});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * GET /game/:id
 * Game
 */
exports.exploreGame = async(req, res) => {
    try{
        let gameId = req.params.id; // Routes의 /game/:id
        const game = await Game.findById(gameId);

        res.render('game', {title: 'GIRIN - Game', game });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * POST /search
 * Search
 */

exports.searchGame = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let searchCon = req.body.searchCon;
        console.log(searchTerm)
        console.log(searchCon)
        if(searchCon == 'name')
        {
            let game = await Game.find({name: new RegExp(searchTerm)});
            res.render('search', {title: 'GIRIN - Search', game });
        }
        else if (searchCon == 'email'){
            let game = await Game.find({email: new RegExp(searchTerm)});
            res.render('search', {title: 'GIRIN - Search', game });
        }
        else if (searchCon == 'desc'){
            let game = await Game.find({description: new RegExp(searchTerm)});
            res.render('search', {title: 'GIRIN - Search', game });
        }
        else if (searchCon == 'review'){
            let game = await Game.find({review: new RegExp(searchTerm)});
            res.render('search', {title: 'GIRIN - Search', game });
        }

        
        
        
        //let game = await Game.find( { $text: { $search: searchTerm, $diacriticSensitive: true} });
        
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
 }

/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatest = async(req, res) => {
    try{
        const limitNumber = 20;
        const game = await Game.find({}).sort({ _id: -1 }).limit(limitNumber);
        res.render('explore-latest', {title: 'GIRIN - 최신 순', game });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}


/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async(req, res) => {
    try{
        let count = await Game.find().countDocuments(); //games 컬렉션의 document의 개수
        let random = Math.floor(Math.random() * count);
        let game = await Game.findOne().skip(random).exec();
        res.render('explore-random', {title: 'GIRIN - 랜덤 게임 추천', game });
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

/**
 * GET /submit-game
 * Submit Game
*/
exports.submitGame = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-game', {title: 'GIRIN - 게임 리뷰 작성', infoErrorsObj, infoSubmitObj });
}

/**
 * POST /submit-game
 * Submit Game
*/
exports.submitGameOnPost = async(req, res) => {
    try{
        let imageUploadFile; // 업로드한 파일
        let uploadPath; // 업로드 시킬 폴더 경로
        let newImageName; // db에 저장할 파일이름 새로 생성ㅇ

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files where uploaded.');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, (err)=> {
                if(err) return res.status(500).send(err);
            })
        }
        const author = req.user.id; // 현재 로그인 되어있는 계정의 _id
        const Cemail = req.user.email; //현재 로그인 되어있는 계정의 이메일
        const newGame = new Game({
            name: req.body.name,
            pros: req.body.pros,
            cons: req.body.cons,
            description: req.body.description,
            review: req.body.review,
            email: Cemail,
            elements: req.body.elements,
            category: req.body.category,
            image: newImageName,
            author: author
        });

        await newGame.save();
        console.log(author);

        req.flash('infoSubmit', '게시글이 업로드 되었습니다.')
        res.redirect('/submit-game');
    } catch (error){
        req.flash('infoErrors', error);
        res.redirect('/submit-game');
    }
 }

exports.editGame = async(req, res) => {
    try {
        if(req.user){ // 로그인 중이면서 작성자일 경우만 삭제가능
            let gameId = req.params.id; // 게임 게시물 _id
            const userId = req.user._id; //로그인 중인 사용자 _id
            const authorId = await Game.findById(gameId, {author:true, _id:false}); // 게시물 작성자 아이디
            if(userId == authorId.author){ // 현재 로그인 중인 사용자 _id와 게시물 작성자가 같은 경우
                let game = await Game.findById(gameId);
                res.render('edit-game', {title: 'GIRIN - edit', game }); // 글 수정페이지로 이동

            }
            else{
                res.send("<script>alert('작성자가 아닙니다.');history.back();</script>");
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>");
        }
    } catch (error) {
        console.log(`Error fetching game by ID: ${error.message}`);
    }
}


exports.updateGame = async(req, res) => {
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            newImageName = Game.image;
            console.log('사진 그대로')
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, (err)=> {
                if(err) return res.status(500).send(err);
            })

        }

        const getGameParams = body => {
            return {
                name: body.name,
                description: body.description,
                review: body.review,
                pros: body.pros,
                cons: body.cons,
                elements: body.elements,
                category: body.category,
                image: newImageName
            };
        };
        // 작성자는 변경이 없으므로 email은 가져오지않음
        let gameId = req.params.id;
        const gameParams = getGameParams(req.body);

        await Game.findByIdAndUpdate(gameId, {$set: gameParams})
        res.redirect(`/game/${ gameId }`);
        // res.game = game;
    } catch (error) {
        console.log(`Error updating game by ID: ${error.message}`);
    }

}

exports.deleteGame = async(req, res) => {
    try {    
        const admin = req.user.admin
        console.log(admin);
        if(req.user){ // 로그인 중일때
            let gameId = req.params.id; // 게임 게시물 _id
            const userId = req.user._id; //로그인 중인 사용자 _id
            const authorId = await Game.findById(gameId, {author:true, _id:false}); // 게시물 작성자
            if(userId == authorId.author || admin == true){ // 로그인된 사용자 아이디가 작성자와 같은 경우 또는 어드민
                
                await Game.findByIdAndRemove(gameId)
                res.send("<script>alert('글이 삭제되었습니다.');location.href='/';</script>");
                // console.log(gameId)
                // console.log(userId)
                // console.log(authorId.author)
            }
            else{
                res.send("<script>alert('작성자가 아닙니다.');history.back();</script>");
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>");
        }
    } catch (error) {
        console.log(`Error deleting game by ID: ${error.message}`);
    }
}

















// 삭제 예제
// async function deleteGame(){
//     try {
//         await Game.deleteOne({ name: '이미지테스트 업데이트' });
        
//     } catch (error) {
//         console.log(error);
//     }
// }

// deleteGame();












//업데이트 예제
// async function updateGame(){
//     try {
//         const res = await Game.updateOne({ name: '이미지테스트'}, { name: '이미지테스트 업데이트'});
//         res.n; // Number of documents matched
//         res.nModified; // Number of documents modified
        
//     } catch (error) {
//         console.log(error);
//     }
// }

// updateGame();

 



// async function insertDummyCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 "name": "Adventure",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "Rhythm",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Sports",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Shooting",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Simulation",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Action",
//                 "image": "spanish-food.jpg"
//             },
//             {
//                 "name": "Puzzle",
//                 "image": "spanish-food.jpg"
//             },
//             {
//                 "name": "Board",
//                 "image": "spanish-food.jpg"
//             },
//             {
//                 "name": "BattleRoyal",
//                 "image": "spanish-food.jpg"
//             },
//             {
//                 "name": "Social",
//                 "image": "spanish-food.jpg"
//             }
//         ]
//         );
//     } catch (error){
//         console.log('err', + error)
//     }
// }

// insertDummyCategoryData();



// //게임 데이터
// async function insertDummyGameData(){
//     try{
//         await Game.insertMany([
//                   { 
//                     "name": "리듬게임입니다",
//                     "description": `Game Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "elements": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Rhythm", 
//                     "image": "southern-friend-chicken.jpg"
//                   },
//                   { 
//                     "name": "어드벤처",
//                     "description": `Game Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "elements": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Adventure", 
//                     "image": "southern-friend-chicken.jpg"
//                   },
//                   { 
//                     "name": "슈팅",
//                     "description": `Game Description Goes Here`,
//                     "email": "recipeemail@raddy.co.uk",
//                     "ingredients": [
//                       "1 level teaspoon baking powder",
//                       "1 level teaspoon cayenne pepper",
//                       "1 level teaspoon hot smoked paprika",
//                     ],
//                     "category": "Shooting", 
//                     "image": "southern-friend-chicken.jpg"
//                   }
//                 ]);
//     } catch (error){
//         console.log('err', + error)
//     }
// }

// insertDummyGameData();