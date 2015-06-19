var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var bodyParser=require('body-parser');
var fs=require('fs');


var EntryModel=new Schema({
    title:  String,
    description:   String,
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
    var entry=new Entry({title:req.body.title,description:req.body.description,date:Date(),meta:{votes:0,favs:0},location:[req.body.loc.lat,req.body.loc.lon],img:{data:req.body.img.data,contentType:req.body.img.contentType}});
    console.log(req.body);
//    fs.readFile(req.files.image, function (err, data) {
//        console.log('got file');
//        var newPath = __dirname + "/uploads/uploadedFileName";
//        fs.writeFile(newPath, data, function (err) {
//            res.redirect("back");
//        });
//    });
    entry.save(function(err, r){
        console.log('Saved Entry');
        res.send("Success");
    });
});
module.exports = router;
