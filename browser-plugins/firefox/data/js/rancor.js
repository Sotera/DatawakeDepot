
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
        interaction:{hover:true},
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
        window.open('https://www.reddit.com/r/Bitcoin/comments/3aqwxo/bitcoin_spotted_at_the_end_austerity_now_protest/', '_blank');
    });
    network.on('hoverNode', function (params) {
        $('#popup').text(data.nodes[params.node].url);
    });
    network.on("blurNode", function (params) {
        $('#popup').text('');
    });
}