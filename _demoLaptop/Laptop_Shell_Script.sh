#!/bin/bash
docker run -dt --name datawake-mongo -h mongo datawake/mongo:2.0
docker run -dt --name datawake-depot -h datawake --link datawake-mongo:mongo -p 8701:8701 -p 8082:3001 datawake/datawake:2.0