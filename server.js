var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var questions = require('./models/question.js');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;

mongoose.connect('mongodb://qchat:qchat@ds061641.mongolab.com:61641/qchat');

app.use(express.static('public'));
//app.use('/public/assets', express.static(__dirname + '/public/assets'));


var Schema = mongoose.Schema;

var userSchema = new Schema({

    _id : String,
    question:String,
    userid: String,
    upvotes: Number,
    spam : Boolean,
    spamcount : Number,
    postedon : Date,
   // keywords : [String]
});
var qmodel = mongoose.model('question',userSchema);
app.get('/questions', function (req,res){
   mongoose.model('question').find(function(err,qs){
   	res.send(qs);
   })
});

io.on('connection', function(socket){
   console.log('user connected');

   socket.on('error', function (err) { console.error(err.stack); });
     
    socket.on('askquestion', function(msg){    
      console.log('message recieved ');
      var q = JSON.parse(msg);

      
        qm = new qmodel();
        qm._id = new mongoose.Types.ObjectId();;
    	qm.question = q.question;
    	qm.userid = q.userid;
    	qm.upvotes = q.upvotes;
    	qm.spam = q.spam;
    	qm.spamcount = q.spamcount;
    	qm.postedon = q.postedon;
    	//qm.keywords = q.keywords;
    	q._id = qm._id;
    	qm.save(function (err) {

    		mongoose.model('question').find(function(err,qs){
   			io.emit('postquestion', JSON.stringify(q));
   })


  
});
      
      
    });


    socket.on('upvote', function(msg){

    	qu = new qmodel();

    	qu.update({_id:msg},{ $inc: { upvotes: 1}});
    	io.emit('incupvote',msg);

    });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});