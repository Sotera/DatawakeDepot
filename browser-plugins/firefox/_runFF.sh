#!/bin/bash
#jpm run -b /usr/bin/firefox -p datawake

#Uses Extension Auto-Installer plugin (v.1.2.2.1-signed) by Wladimir Palant
../../node_modules/jpm/bin/jpm xpi
mkdir -p ../../client/app/xpi
cp datawakeffplugin.xpi ../../client/app/xpi/datawakePlugin.xpi
wget --post-file=datawakeffplugin.xpi http://localhost:8888/
