var {pluginState} = require('./data/pluginState');
//When running locally comment out the datawake-depot.org settings and use the localhost ones
//pluginState.pageModDatawakeDepotIncludeFilter = '*.datawake-depot.org';
//pluginState.loginUrl = 'http://datawake-depot.org';

pluginState.pageModDatawakeDepotIncludeFilter = 'http://107.22.130.72:3000/*';
pluginState.loginUrl = 'http://107.22.130.72:3000';
//Edit this to be a valid Rancor instance
pluginState.trailUrlRancor = 'http://52.1.251.62:3004/api/rank/process';

require('./data/contextMenu').init();
require('./data/pageMods').init();
require('./data/addin').init();
