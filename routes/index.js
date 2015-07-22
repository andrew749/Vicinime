var express = require('express');
var router = express.Router();
var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var bodyParser=require('body-parser');
var fs=require('fs');
var request=require('request');
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
var dir="files/"
router.post('/upload',function(req,res){
    var entry=new Entry({title:req.body.title,description:req.body.description,date:Date(),meta:{votes:0,favs:0},loc:{type:"Point",coordinates:[req.body.loc.lon,req.body.loc.lat]},img:{data:"temp",contentType:req.body.img.contentType}});
    entry.img.data="files/"+entry._id;
    //save an entry to the connected db
    entry.save(function(err, r){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFile(dir+entry._id, req.body.img.data, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
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
    //1km default distance
    var maxDistance = req.body.distance || 1000;
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
        for (var x in locations){
            locations[x].img.data=fs.readFileSync(dir+locations[x]._id);
        }
        res.json(200, locations);
    });
});
router.get('/upvote/:postid',function(req,res){
    Entry.update(
        {_id:req.params.postid},
        {
            $inc:{
                "meta.votes":1
            }
        }
        ,null,function(){
            res.send("Updated");
        });

});
router.get('/downvote/:postid',function(req,res){
    Entry.update(
        {_id:req.params.postid},
        {
            $inc:{
                "meta.votes":-1
            }
        }
        ,null,function(){
            res.send("Updated");
        });

});
router.get('/favorite/:postid',function(req,res){
    Entry.update(
        {_id:req.params.postid},
        {
            $inc:{
                "meta.favs":1
            }
        }
        ,null,function(){
            res.send("Favorited");
        });

});

router.get('/events',function(req,res){
  searchEventsNearLocation(req.latitude,req.longitude,req.distance,function(error,response,body){
    res.send(filterResponse(response));
  });
});
var baseURL='https://www.eventbriteapi.com/v3/';

function searchEventsNearLocation(latitude,longitude,distance, callback){
  var urlString=baseURL+'events/search/';
  var propertiesObject={
    'location.longitude':   longitude,
    'location.latitude' :   latitude,
    'location.within'   :   distance+'km',
    'sort_by'           :   'distance',
    'popular'           :   true
  };
  request.get({
    headers:{'Authorization':'Bearer '+OAUTH},
    url:urlString,
    form: propertiesObject
  },callback);
}

function filterResponse(response){
  var eventCode = JSON.parse(response.body);
  var events = [];
  for (x in eventCode.events){
    //console.log('#####EVENT NUMBER '+x+'##########\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    var object= eventCode.events[x];
    console.log(object.name.text);
    events.push(object);
  }
  return events;
}
var OAUTH="OJS4GQXGCLXQVD4AMCZN";
module.exports = router;

