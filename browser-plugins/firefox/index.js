var {pluginState} = require('./data/pluginState');
pluginState.pageModDatawakeDepotIncludeFilter = '*.datawake-depot.org';
pluginState.pageModDatawakeDepotIncludeFilter = 'http://localhost:3000/*';
pluginState.loginUrl = 'http://datawake-depot.org';
pluginState.loginUrl = 'http://localhost:3000';
require('./data/contextMenu').init();
require('./data/pageMods').init();
require('./data/addin').init();

