
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

    // add event listeners
    network.on('select', function (params) {
        window.open(data.nodes[params.nodes[0]].url, '_blank');
    });
}