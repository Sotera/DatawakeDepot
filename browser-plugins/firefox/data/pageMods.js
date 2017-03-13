var {pluginState} = require('./pluginState');
exports.init = function () {
  var pageMod = require('sdk/page-mod');
  try {
    pageMod.PageMod({
      include: '*',
      exclude: pluginState.pageModDatawakeDepotIncludeFilter, // this prevents Depot urls from being trailed and paneled
      contentScriptFile: [
        './vendor/jszip/jszip.min.js',
        './vendor/jquery/jquery-2.1.4.min.js',
        './vendor/jquery/jquery.highlight-jreeme.js',
        //'./vendor/highlightRegex/highlightRegex.min.js',
        './injectedPageScripts/datawake-analysis.js',
        './injectedPageScripts/scraper.js'],
      attachTo: ['existing', 'top'],
      onAttach: pluginState.onContentScriptAttach
    });
  }
  catch (err) {
    console.log(err);
  }
  try {
    pageMod.PageMod({
      include: pluginState.pageModDatawakeDepotIncludeFilter,
      //exclude: '*',
      contentScriptFile: './injectedPageScripts/datawake-depot.js',
      attachTo: ['existing', 'top'],
      onAttach: pluginState.onDatawakeDepotContentScriptAttach
    });
  }
  catch (err) {
    console.log(err);
  }
};
