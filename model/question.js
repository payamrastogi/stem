var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({

    question:String,
    userid: String,
    upvotes: Number,
    spam : Boolean,
    spamcount : Number,
    postedon : Date,
    tags : [String]
});

mongoose.model('question',userSchema);