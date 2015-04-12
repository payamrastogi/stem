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
app.set('view engine', 'jade');


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
var qmodel2 = mongoose.model('question2',userSchema);
app.get('/questions', function (req,res){
   mongoose.model('question').find(function(err,qs){
   	res.send(qs);
   })
});

app.get('/questions2', function (req, res) {

  mongoose.model('question2').find(function(err,qs){
        res.send(qs);
   });
  
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
   });
    });
    });

        socket.on('askquestion2', function(msg){    
      console.log('message recieved ');
      var q = JSON.parse(msg);

      
        qm2 = new qmodel2();
        qm2._id = new mongoose.Types.ObjectId();;
      qm2.question = q.question;
      qm2.userid = q.userid;
      qm2.upvotes = q.upvotes;
      qm2.spam = q.spam;
      qm2.spamcount = q.spamcount;
      qm2.postedon = q.postedon;
      //qm.keywords = q.keywords;
      q._id = qm2._id;
      qm2.save(function (err) {

        mongoose.model('question2').find(function(err,qs){
        io.emit('postquestion2', JSON.stringify(q));
   });


  

      
      
    });

    });


    socket.on('upvote', function(msg){

    	//qu = new qmodel();

    	qmodel.update({_id:msg},{ $inc: { upvotes: 1}},{multi:true},function  (err, numAffected) {
  // numAffected is the number of updated documents
});
    	io.emit('incupvote',msg);

    });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});