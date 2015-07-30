#Vicinime
###Explore today.
##Requirements
* mongodb server running
* nodejs installed with express

##Simple request
###add an entry to the db
curl -X POST -H "Content-Type: application/json" -d '{"title":"Andrew","description":"Test description","loc":{"lon":43.7990603,"lat":-79.5717607},"img":{"data":"test","contentType":"media/jpeg"}}' http://localhost:3000/upload

###find locations near a point
curl -X POST -H "Content-Type: application/json" -d '{"lon":43.7990603,"lat":-79.5717607, "distance":1000}' http://localhost:3000/near

###upvote a post

curl -X GET http://localhost:3000/upvote/post-id

###favorite a post
curl -X GET http://localhost:3000/favorite/post-id
