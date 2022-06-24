require('../models/database');
const Category = require('../models/Category');
const Game = require('../models/Game');


// GET 
// 홈 페이지
exports.homepage = async(req, res) => {
    try{
        const limitNumber = 5;// 사이트에 보여질 개수
        const categories = await Category.find({}).limit(limitNumber); // 설정된 개수 만큼 Category find() 
        const latest = await Game.find({}).sort({_id: -1}).limit(limitNumber); // 글 작성된 순서 역순 (1,2,3,4,5-> 5,4,3,2,1) 으로 새로 작성된 것부터 열람가능
        const adventure = await Game.find({ 'category': 'Adventure' }).limit(limitNumber); // 어드벤처 카테고리의 게임들을 설정된 개수까지 나타냄
        const rhythm = await Game.find({ 'category': 'Rhythm' }).limit(limitNumber); // 리듬 카테고리의 게임들을 설정된 개수까지 나타냄
        const sports = await Game.find({ 'category': 'Sports' }).limit(limitNumber); // 스포츠 카테고리의 게임들을 설정된 개수까지 나타냄

        const genre = { latest, adventure, rhythm, sports }; // 메인에 보여줄 항목들을 ejs에서 쓰기위해 선언


        res.render('index', {title: 'GIRIN - Home', categories, genre}); // index.ejs를 렌더링.
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"}); 
    }

}


// GET /categories
// 카테고리
exports.exploreCategories = async(req, res) => {
    try{
        const limitNumber = 20; // 사이트에 보여질 개수
        const categories = await Category.find({}).limit(limitNumber); //카테고리 컬렉션에서 최대 20개까지 찾기
        res.render('categories', {title: 'GIRIN - Categories', categories}); // categories.ejs를 렌더링.
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET  /categories/:id
// 카테고리 별 목록, 앨범 버전
exports.exploreCategoriesById = async(req, res) => {
    try{
        let categoryId = req.params.id; // /categories/(:id) <- 를 읽어옴
        const categoryById = await Game.find({ 'category': categoryId }); // 읽어온 :id 값으로 games 컬렉션에서 카테고리가 :id와 일치하는 값을 검색
        res.render('categoriesId', {title: 'GIRIN - Categories', categoryById, categoryId}); // categoriesId.ejs를 렌더링.
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET  /categories/:id/list
// 카테고리 별 목록, 리스트 버전
exports.exploreCategoriesByIdlist = async(req, res) => {
    try{
        let categoryId = req.params.id;// /categories/(:id) <- 를 읽어옴
        const categoryById = await Game.find({ 'category': categoryId }); // 읽어온 :id 값으로 games 컬렉션에서 카테고리가 :id와 일치하는 값을 검색
        res.render('categoriesId_list', {title: 'GIRIN - Categories', categoryById, categoryId});// categoriesId_list.ejs를 렌더링.
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET /game/:id
// 게임 리뷰 글
exports.exploreGame = async(req, res) => {
    try{
        let gameId = req.params.id; // /game/(:id) <- 를 읽어옴
        const game = await Game.findById(gameId); // games 컬렉션에서 _id가 :id랑 일치하는 것을 검색
        res.render('game', {title: 'GIRIN - Game', game }); // game.ejs를 렌더링
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// POST /search
// 검색 기능
exports.searchGame = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm; // 검색어를 읽어옴
        let searchCon = req.body.searchCon; // 검색 조건을 읽어옴
        if(searchCon == 'name') {  // 검색 조건이 제목일 때
            let game = await Game.find({name: new RegExp(searchTerm)}); // 정규표현식을 이용해 검색어로 games 컬렉션의 이름 검색
            res.render('search', {title: 'GIRIN - Search', game }); // search.ejs 렌더링
        }
        else if (searchCon == 'email') {  // 검색 조건이 이메일일 때
            let game = await Game.find({email: new RegExp(searchTerm)}); // 정규표현식을 이용해 검색어로 games 컬렉션의 이메일 검색
            res.render('search', {title: 'GIRIN - Search', game }); // search.ejs 렌더링
        }
        else if (searchCon == 'desc') { // 검색 조건이 설명일 때
            let game = await Game.find({description: new RegExp(searchTerm)}); // 정규표현식을 이용해 검색어로 games 컬렉션의 설명 검색
            res.render('search', {title: 'GIRIN - Search', game }); // search.ejs 렌더링
        }
        else if (searchCon == 'review') { // 검색 조건이 소감일 때
            let game = await Game.find({review: new RegExp(searchTerm)}); // 정규표현식을 이용해 검색어로 games 컬렉션의 소감 검색
            res.render('search', {title: 'GIRIN - Search', game }); // search.ejs 렌더링
        }
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
 }

// GET /explore-latest
// 최신 글 보기
exports.exploreLatest = async(req, res) => {
    try{
        const limitNumber = 20; // 사이트에 보여질 최대 개수 설정
        const game = await Game.find({}).sort({ _id: -1 }).limit(limitNumber); // Game collection에서 검색하는데 조건으로 _id 역순으로 하여 마지막에 생성된 document 순서대로 정렬됨.
        res.render('explore-latest', {title: 'GIRIN - 최신 순', game }); // explore-latest.ejs 랜더링
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET /explore-random
// 랜덤 게임 한 개 보여주기
exports.exploreRandom = async(req, res) => {
    try{
        let count = await Game.find().countDocuments(); //games collection의 document의 개수
        let random = Math.floor(Math.random() * count); // document 개수와 같거나 작은 정수중에서 가장 큰 수를 랜덤으로 반환
        let game = await Game.findOne().skip(random).exec(); // 랜덤으로 반환 된 수만큼 넘어가서 조회
        res.render('explore-random', {title: 'GIRIN - 랜덤 게임 추천', game }); //explore-random.ejs를 렌더링
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occured"});
    }
}

// GET /submit-game
// 게임 리뷰 글 작성
exports.submitGame = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors'); // 오류 시 flash 메시지
    const infoSubmitObj = req.flash('infoSubmit'); // 제출 시 flash 메시지
    res.render('submit-game', {title: 'GIRIN - 게임 리뷰 작성', infoErrorsObj, infoSubmitObj }); // submit-game.ejs 렌더링
}

// POST /submit-game
// 게임 리뷰 글 작성
exports.submitGameOnPost = async(req, res) => {
    try{
        let imageUploadFile; // 업로드한 사진 파일
        let uploadPath; // 업로드 시킬 폴더 경로
        let newImageName; // db에 저장할 파일이름 새로 생성

        if(!req.files || Object.keys(req.files).length === 0) { // 파일이 업로드 되지 않았을 경우
            console.log('No Files where uploaded.'); 
        } else { // 업로드 되었을 경우
            imageUploadFile = req.files.image; // 올라온 파일이름을 가져온다
            newImageName = Date.now() + imageUploadFile.name; // 파일이름이 중복이면 문제가 생길 수 있기에 Date.now()를 파일이름에 더해 새로 저장.
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName; // 파일 업로드 될 경로 설정

            imageUploadFile.mv(uploadPath, (err)=> { // 파일을 해당 경로로 업로드
                if(err) return res.status(500).send(err);
            })
        }
        const author = req.user.id; // 현재 로그인 되어있는 계정의 _id
        const Cemail = req.user.email; //현재 로그인 되어있는 계정의 이메일
        const newGame = new Game({ // submit-game.ejs에 작성되어있는 데이터들을 불러오고
            name: req.body.name,
            pros: req.body.pros,
            cons: req.body.cons,
            description: req.body.description,
            review: req.body.review,
            email: Cemail, // 이메일은 로그인 되어있는 계정의 이메일
            elements: req.body.elements,
            category: req.body.category,
            image: newImageName,
            author: author // 작성자는 로그인 되어있는 계정의 _id
        });

        await newGame.save(); // 위 데이터를 기반으로 새 document 작성
        req.flash('infoSubmit', '게시글이 업로드 되었습니다.') // 게시글이 정상적으로 업로드 되면 flash 메시지 출력
        res.redirect('/submit-game'); // submit-game.ejs로 이동
    } catch (error){
        req.flash('infoErrors', error); // 오류가 있을 시 메시지가 flash 메시지로 출력
        res.redirect('/submit-game'); // 똑같이 submit-game.ejs로 이동
    }
 }

// GET /game/:id/edit
// 게임 리뷰 글 수정
exports.editGame = async(req, res) => {
    try {
        if(req.user){ // 로그인 중일 때
            let gameId = req.params.id; // 게임 게시물 _id
            const userId = req.user._id; // 로그인 중인 사용자 _id
            const authorId = await Game.findById(gameId, {author:true, _id:false}); // 게시물 작성자 아이디
            if(userId == authorId.author) { // 현재 로그인 중인 사용자 _id와 게시물 작성자가 같은 경우
                let game = await Game.findById(gameId); // 해당 글을 검색하여
                res.render('edit-game', {title: 'GIRIN - edit', game }); // 글 수정페이지로 이동

            }
            else { // 로그인 중인 사용자와 작성자가 다른경우 
                res.send("<script>alert('작성자가 아닙니다.');history.back();</script>"); // 오류 메시지와 함께 뒤로가기
            }
        } else { // 로그인 중이 아닐 경우
            res.send("<script>alert('로그인 해주세요.');history.back();</script>");  // 오류 메시지와 함께 뒤로가기
        }
    } catch (error) {
        console.log(`Error fetching game by ID: ${error.message}`);
    }
}

// PUT /game/:id/update
// 게임 리뷰 글 수정
exports.updateGame = async(req, res) => {
    try {
        let imageUploadFile; // 업로드한 파일 사진
        let uploadPath; // 업로드 시킬 폴더 경로
        let newImageName; // db에 저장할 파일이름 새로 생성

        if(!req.files || Object.keys(req.files).length === 0) { // 업로드한 사진이 없을 경우
            newImageName = Game.image; // 기존에 있던 image이름을 그대로 사용
        } else { // 업로드 했을 경우
            imageUploadFile = req.files.image; // 올라온 파일이름을 가져온다
            newImageName = Date.now() + imageUploadFile.name; // 파일이름이 중복이면 문제가 생길 수 있기에 Date.now()를 파일이름에 더해 새로 저장.
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName; // 파일 업로드 될 경로 설정

            imageUploadFile.mv(uploadPath, (err)=> {  // 파일을 해당 경로로 업로드
                if(err) return res.status(500).send(err);
            })
        }

        const getGameParams = body => { // edit-game.ejs에 작성되어있는 데이터들을 불러오고
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
        // author도 변경 할 이유가 없음.
        let gameId = req.params.id; // /game/:id/update의 :id 불러옴
        const gameParams = getGameParams(req.body); //getGameParams의 body

        await Game.findByIdAndUpdate(gameId, {$set: gameParams}) // games 컬렉션에서 검색하여 해당 document에 gameParams 내용을 업데이트
        res.redirect(`/game/${ gameId }`); // 수정 된 게임 리뷰 글 화면으로 감
    } catch (error) {
        console.log(`Error updating game by ID: ${error.message}`);
    }
}

// delete /game/:id/delete
// 게임 리뷰 글 삭제
exports.deleteGame = async(req, res) => {
    try {    
        if(req.user) { // 로그인 중일때
            const admin = req.user.admin // 로그인 중인 사용자의 admin 값을 불러옴
            let gameId = req.params.id; // 게임 게시물 _id
            const userId = req.user._id; //로그인 중인 사용자 _id
            const authorId = await Game.findById(gameId, {author:true, _id:false}); // 게시물 작성자
            if(userId == authorId.author || admin == true){ // 로그인된 사용자 아이디가 작성자와 같은 경우 또는 어드민일 경우
                await Game.findByIdAndRemove(gameId) // games 컬렉션에서 _id가 gameId랑 같은 것을 찾아 해당 document 삭제 
                res.send("<script>alert('글이 삭제되었습니다.');location.href='/';</script>"); // 알림 후 홈페이지로
            }
            else{
                res.send("<script>alert('작성자가 아닙니다.');history.back();</script>"); // 작성자가 아닌 경우 알림 후 뒤로가기
            }
        } else {
            res.send("<script>alert('로그인 해주세요.');history.back();</script>"); // 로그인 되어있지 않으면 알림 후 뒤로가기
        }
    } catch (error) {
        console.log(`Error deleting game by ID: ${error.message}`);
    }
}
