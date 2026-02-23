// Interactive graph for Obsidian notes
$(document).ready(function() {
    // Create graph container
    var container = document.getElementById('interactive-graph');
    if (!container) {
        container = document.createElement('div');
        container.id = 'interactive-graph';
        container.style.width = '100%';
        container.style.height = '400px';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '4px';
        document.querySelector('.md-sidebar--secondary .md-sidebar__inner').appendChild(container);
    }

    // Collect nodes and edges from wiki-links
    var nodes = new vis.DataSet([]);
    var edges = new vis.DataSet([]);
    var nodeIds = new Set();
    
    // Add current page as node
    var currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    nodeIds.add(currentPage);
    nodes.add({id: currentPage, label: currentPage, color: '#FF6E42'});
    
    // Find all wiki-links in the page
    $('a').each(function() {
        var href = $(this).attr('href');
        if (href && href.includes('.html')) {
            var target = href.split('/').pop().replace('.html', '');
            if (target && target !== currentPage) {
                if (!nodeIds.has(target)) {
                    nodeIds.add(target);
                    nodes.add({id: target, label: target});
                }
                edges.add({from: currentPage, to: target});
            }
        }
    });

    // Create network
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 12,
                color: '#000000'
            },
            borderWidth: 2
        },
        edges: {
            width: 1,
            color: '#888888'
        },
        physics: {
            enabled: true,
            stabilization: true
        }
    };
    var network = new vis.Network(container, data, options);
});
