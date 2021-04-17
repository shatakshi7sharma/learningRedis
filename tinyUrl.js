const mongoose = require('mongoose');

const Url = new mongoose.Schema({
    longurl : {type: String, required: true},
    shorturl: {type: String, required: true}, 
    hitCount:{type: Number}
  
},{
    timestamps: true
})

module.exports = mongoose.model('Url', Url);