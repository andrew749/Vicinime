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
    loc: { type: {type:String}, coordinates: [Number]},
    //data will hold the 64bit data of the file
    img:{data:String,contentType:String},
});


//create data model
var Entry=mongoose.model('Entry',EntryModel);
EntryModel.index({loc:1});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('post');
});


router.post('/upload',function(req,res){
    var entry=new Entry({title:req.body.title,description:req.body.description,date:Date(),meta:{votes:0,favs:0},loc:{type:"Point",coordinates:[req.body.loc.lon,req.body.loc.lat]},img:{data:req.body.img.data,contentType:req.body.img.contentType}});
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
router.post('/near',function(req,res){
//    var limit = req.query.limit || 10;

    // get the max distance or set it to 8 kilometers
    var maxDistance = req.body.distance || 8;

    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    maxDistance /= 6371;
    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = req.body.lon;
    coords[1] = req.body.lat;
    console.log(coords+" distance:"+maxDistance);
    // find a location
    Entry.find({
      loc: {
        $near: { 
            $geometry: {
                    type: "Point" ,
                    coordinates: coords
                },
                $maxDistance: maxDistance
      }
    }}).exec(function(err, locations) {
      if (err) {
        return res.json(500, err);
      }
        console.log(locations);
      res.json(200, locations);
    });
});
module.exports = router;
