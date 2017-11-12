var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TodoSchema = new Schema({
    //id: Number,
    //user_id: Number,
    title: String,
    desc: String
});

module.exports = mongoose.model('Todo', TodoSchema);