#!/bin/bash
docker run -dt --name datawake_all -h datawake -p 8182:8182 -p 8701:8701 -p 8082:3001 jreeme/datawake:19-MAY-2016
