#comment out next two lines to persist data between restarts

docker stop datawake
docker rm datawake

docker run -dt --name datawake -h dw-data jreeme/datawake:18-MAY-2016
