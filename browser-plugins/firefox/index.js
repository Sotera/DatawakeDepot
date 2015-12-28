var {pluginState} = require('./data/pluginState');
//When running locally comment out the datawake-depot.org settings and use the localhost ones
pluginState.pageModDatawakeDepotIncludeFilter = '*.datawake-depot.org';
pluginState.loginUrl = 'http://datawake-depot.org';

//pluginState.pageModDatawakeDepotIncludeFilter = 'http://localhost:3000/*';
//pluginState.loginUrl = 'http://localhost:3000';

require('./data/contextMenu').init();
require('./data/pageMods').init();
require('./data/addin').init();

