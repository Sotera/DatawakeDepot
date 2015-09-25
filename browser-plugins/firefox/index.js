var pluginState = require('./data/pluginState').getPluginState();
pluginState.pageModDatawakeDepotIncludeFilter = 'http://localhost:3000/*';
//pluginState.pageModDatawakeDepotIncludeFilter = '*.datawake-depot.org';
pluginState.loginUrl = 'http://localhost:3000';
//pluginState.loginUrl = 'http://datawake-depot.org';
require('./data/contextMenu').init();
require('./data/pageMods').init();
require('./data/toolbarAddin').init();

