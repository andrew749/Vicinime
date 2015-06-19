var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var fs=require('fs');


var EntryModel=new Schema({
    title:  String,
    body:   String,
    date: { type: Date, default: Date.now },
    meta: {
        votes: Number,
        favs:  Number
    },
    location:[Number,Number],
    img:{data:Buffer,contentType:String}
});
//create data model
var Entry=mongoose.model('Entry',EntryModel);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('post');
});

router.post('/upload',function(req,res){
//    var test=new Entry({title:'andrew',body:'test'});
//    test.img.data=req.files;
//    test.img.contentType='image/jpeg';
    console.log(req);
    fs.readFile(req.files.image, function (err, data) {
        console.log('got file');
        var newPath = __dirname + "/uploads/uploadedFileName";
        fs.writeFile(newPath, data, function (err) {
            res.redirect("back");
        });
    });
//    console.log('1');
//    test.save(function(err, r){
//        console.log('Saved Entry');
//        res.render('index',{title:'Got request'});
//    });
});
module.exports = router;
