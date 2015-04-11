var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({

    answer:String,
    userid: String,
    upvotes: Number,
    spam : Boolean,
    spamcount : Number,
    postedon : Date,
    tags : [String]
});

mongoose.model('answer',answerSchema);