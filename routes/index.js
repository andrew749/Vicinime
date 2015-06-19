var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var EntryModel=new Schema({
    title:  String,
    body:   String,
    date: { type: Date, default: Date.now },
    meta: {
      votes: Number,
      favs:  Number
    },
    location:[Number,Number]
  });
var Entry=mongoose.model('Entry',EntryModel);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/upload',function(req,res){
    var test=new Entry({title:'andrew',body:'test'});
    console.log('1');
    test.save(function(err, res){
        console.log('did something');
    });
});
module.exports = router;
