var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var questions = require('./models/question.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
app.use(express.static('public'));

app.get('/questions', function (req,res){
   mongoose.model('question').find(function(err,qs){
   	res.send(qs);
   })
});

io.on('connection', function(socket){
   console.log('user connected');
     
    socket.on('askquestion', function(msg){    
      console.log('message recieved ');
      io.emit('postquestion', msg);
      
    });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});