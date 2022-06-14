const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/GameReview"
mongoose.connect(url); // db연동

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function(){
      console.log('Connected')
  });

  // Models
  require('./Category');
  require('./Game');
  require('./User');