#!/bin/bash
#jpm run -b /usr/bin/firefox -p datawake

#Uses Extension Auto-Installer plugin (v.1.2.2.1-signed) by Wladimir Palant
jpm xpi
mkdir ../../client/app/xpi
cp @DatawakeFFPlugin-0.0.2.xpi ../../client/app/xpi/datawakePlugin.xpi
wget --post-file=@DatawakeFFPlugin-0.0.2.xpi http://localhost:8889/

