#!/bin/bash
#jpm run -b /usr/bin/firefox -p datawake

#Uses Extension Auto-Installer plugin (v.1.2.2.1-signed) by Wladimir Palant
../../node_modules/jpm/bin/jpm xpi
mkdir ../../client/app/xpi
cp @datawakeffplugin-0.0.2.xpi ../../client/app/xpi/datawakePlugin.xpi

