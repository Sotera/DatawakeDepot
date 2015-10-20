//This is an injected content script. It deals with selected image context menu clicks
self.on('click', function (node, action) {
    var imgSrc = node.src
    self.postMessage(imgSrc)
});