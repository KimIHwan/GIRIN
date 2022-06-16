"use strict";

const mongoose = require("mongoose");
const Category = require("./server/models/Category");
const User = require("./server/models/User");
const bcrypt = require('bcrypt')
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Girin"
);



Category.deleteMany({}).then(() => { // 기본 카테고리 생성
    return Category.create({
        "name": "Adventure",
        "image": "adventure.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Rhythm",
        "image": "rhythm.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Sports",
        "image": "sports.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Shooting",
        "image": "shooting.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Simulation",
        "image": "simulation.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Action",
        "image": "action.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Puzzle",
        "image": "puzzle.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Board",
        "image": "board.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "BattleRoyale",
        "image": "battleroyale.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Social",
        "image": "social.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "RPG",
        "image": "rpg.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => {
    return Category.create({
        "name": "Platform",
        "image": "platform.jpg"
    });
  }).then(Category => console.log(Category.name)).then(() => { 
    return Category.create({
        "name": "Sandbox",
        "image": "sandbox.jpg"
    });
  }).then(User => console.log(User.name)).then(() => { // 어드민 계정 생성
    return User.create({
        "name": "어드민",
        "email": "admin@naver.com",
        "password": 'djemals1',
        "phno": "01022222222",
        "admin": true
    });
  }).then(Category => console.log(Category.name)).catch(error => console.log(error.message)).then(() => {
    console.log("DONE");
    mongoose.connection.close();
  });
