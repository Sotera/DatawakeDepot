var {pluginState} = require('./pluginState');
exports.init = function () {
  var pageMod = require('sdk/page-mod');
  try {
    pageMod.PageMod({
      include: pluginState.pageModDatawakeDepotIncludeFilter,
      contentScriptFile: './injectedPageScripts/datawake-depot.js',
      attachTo: ['existing', 'top', 'frame'],
      onAttach: pluginState.onContentScriptAttach
    });
  }
  catch (err) {
    console.log(err);
  }
};
