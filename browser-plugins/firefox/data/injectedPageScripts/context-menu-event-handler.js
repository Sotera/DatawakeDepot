$(document).ready(function () {
});
self.on('click', function (node, data) {
  //var selectedText = window.getSelection().toString();
/*  node.onkeypress(function(){
    var a = arguments;
    a = arguments;
  });*/
  self.postMessage({data, text: node.value});
});

