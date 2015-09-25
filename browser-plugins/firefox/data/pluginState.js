exports.getPluginState = getPluginState;
var pluginState = null;
function getPluginState() {
  return pluginState || (pluginState = new PluginState());
}
var PluginState = function(){
  this.loggedInUser = null;
  this.loginUrl = null;
  this.toolbarFrameSource = null;
  this.toolbarFrameOrigin = null;
  this.contentScriptHandle = null;
  this.pageModDatawakeDepotIncludeFilter = null;
}

//PluginState.prototype.sayHello = function(){}
