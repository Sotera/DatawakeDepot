exports.getPluginState = getPluginState;
var pluginState = null;
function getPluginState() {
  return pluginState || (pluginState = new PluginState());
}
var PluginState = function(){
  this.loggedInUser = null;
  this.toolbarFrameSource = null;
}

//PluginState.prototype.sayHello = function(){}
