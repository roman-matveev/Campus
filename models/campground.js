var mongoose = require('mongoose');

var cgSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    price: String,
    loc: String,
    lat: Number,
    lng: Number,
    createdAt: {type: Date, default: Date.now},
    author: {id: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, username: String},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
});

var Campground = mongoose.model("Campground", cgSchema);
module.exports = Campground;
