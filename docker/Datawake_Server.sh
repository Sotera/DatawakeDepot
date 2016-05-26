#comment out next two lines to persist data between restarts
#docker stop dw-data
#docker rm dw-data

docker stop dw-mongo
docker rm dw-mongo

docker stop datawake
docker rm datawake

#comment out next line to persist data between restarts
docker run -dt --name dw-data -h dw-data sotera/data-container
docker run -dt --volumes-from dw-data --name dw-mongo -h mongo sotera/datawake-mongo
docker run -dt --name datawake -h datawake --link dw-mongo:mongo --link -p 8701:8701 -p 3001:3001 sotera/datawake-strongloop
