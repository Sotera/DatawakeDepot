let {pluginState} = require('./data/pluginState');
//When running locally comment out the datawake-depot.org settings and use the localhost ones
//pluginState.pageModDatawakeDepotIncludeFilter = '*.datawake-depot.org';
//pluginState.loginUrl = 'http://datawake-depot.org';

let port = '3000';
pluginState.pageModDatawakeDepotIncludeFilter = `http://localhost:${port}/*`;
pluginState.loginUrl = `http://localhost:${port}`;
//Edit this to be a valid Rancor instance
pluginState.trailUrlRancor = 'http://localhost:8182/api/rank/process';

require('./data/contextMenu').init();
require('./data/pageMods').init();
require('./data/addin').init();
