#!/bin/bash
#comment out next two lines to persist data between restarts

docker stop datawake
docker rm datawake

docker run -dt --name datawake -v /tmp:/tmp -h datawake -p 8182:8182 -p 8701:8701 -p 3002:3002 -p 8082:8082 jreeme/datawake:10-MAR-2017
