#Vicinime
##Simple request
curl -X POST -H "Content-Type: application/json" -d '{"title":"Andrew","description":"Test description","loc":{"lat":42,"lon":43},"img":{"data":"test","contentType":"media/jpeg"}}' http://localhost:3000/upload
