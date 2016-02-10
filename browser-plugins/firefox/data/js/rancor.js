
var network = null;


function destroyRancor() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

function drawRancor(urlResults) {

    destroyRancor();

    var data = {nodes: urlResults.nodes, edges: urlResults.edges};

    var options = {
        layout: {
            randomSeed: undefined,
            improvedLayout: false
        },
        nodes: {
            shape: 'dot',
            scaling: {
                customScalingFunction: function (min,max,total,score) {
                    return score/total;
                },
                min:5,
                max:150
            }
        }
    };
    network = new vis.Network(document.getElementById('widgetTwo'), data, options);

        //network.on("showPopup", function (params) {
        //    document.getElementById('eventSpan').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
        //});
        //// add event listeners
        //network.on('select', function (params) {
        //    //document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
        //    document.getElementById('eventSpan').innerHTML = '<h2>Selected Node: </h2> <a href="' + data.nodes[params.nodes[0]].url + '">' +
        //        data.nodes[params.nodes[0]].url + '</a>';
        //});
    }