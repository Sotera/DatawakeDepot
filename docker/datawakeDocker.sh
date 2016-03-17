#comment out next two lines to persist data between restarts
docker stop dw-data
docker rm dw-data

docker stop dw-mongo
docker rm dw-mongo

docker stop datawake
docker rm datawake

docker stop dw-stanNER
docker rm dw-stanNER

docker stop dw-rancor
docker rm dw-rancor

#comment out next line to persist data between restarts
docker run -dt --name dw-data -h dw-data sotera/data-container
docker run -dt --volumes-from dw-data --name dw-mongo -h mongo sotera/datawake-mongo
docker run -dt --name dw-stanNER -h dw-stanNER --link dw-mongo:mongo -p 8703:8701 -p 3003:3001 sotera/datawake-stanner
docker run -dt --name dw-rancor -h dw-rancor --link dw-mongo:mongo -p 8704:8701 -p 3004:3001 sotera/datawake-rancor
docker run -dt --name datawake -h datawake --link dw-mongo:mongo --link dw-stanNER:dw-stanNER --link dw-rancor:dw-rancor -p 8701:8701 -p 3001:3001 sotera/datawake-strongloop
