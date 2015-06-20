var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var bodyParser=require('body-parser');
var fs=require('fs');


//model for simple entry
var EntryModel=new Schema({
    title:  String,
    description:   String,
    date: { type: Date, default: Date.now },
    meta: {
        votes: Number,
        favs:  Number
    },
    loc: [Number,Number],
    //data will hold the 64bit data of the file
    img:{data:String,contentType:String}
});


//create data model
var Entry=mongoose.model('Entry',EntryModel);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('post');
});


router.post('/upload',function(req,res){
    var entry=new Entry({title:req.body.title,description:req.body.description,date:Date(),meta:{votes:0,favs:0},loc:[req.body.loc.lat,req.body.loc.lon],img:{data:req.body.img.data,contentType:req.body.img.contentType}});
    console.log(req.body+"\n\n\n");
    console.log(entry+"\n\n\n");
    //save an entry to the connected db
    entry.save(function(err, r){
        console.log(err);
        if(!err){
            console.log('Saved Entry');
            res.send("Success\n");
        }else{
            res.send("Error: "+err+"\n");
        }
    });
});
//function to return items near a person
router.get('/near',function(req,res){

});
module.exports = router;
