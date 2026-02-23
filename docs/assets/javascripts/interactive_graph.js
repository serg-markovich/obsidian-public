// Interactive graph for Obsidian notes
document.addEventListener('DOMContentLoaded', function() {
    console.log('Interactive graph initializing...');
    
    // Ждем немного, чтобы DOM полностью загрузился
    setTimeout(function() {
        // Проверяем, загружена ли библиотека vis
        if (typeof vis === 'undefined') {
            console.error('vis.js library not loaded');
            return;
        }

        // Ищем правый сайдбар
        const sidebar = document.querySelector('.md-sidebar--secondary');
        if (!sidebar) {
            console.error('Secondary sidebar not found');
            return;
        }

        const sidebarInner = sidebar.querySelector('.md-sidebar__inner');
        if (!sidebarInner) {
            console.error('Sidebar inner not found');
            return;
        }

        // Удаляем существующий граф, если есть
        const existingGraph = document.getElementById('interactive-graph-container');
        if (existingGraph) {
            existingGraph.remove();
        }

        // Создаем контейнер для графа
        const graphContainer = document.createElement('div');
        graphContainer.id = 'interactive-graph-container';
        graphContainer.style.width = '100%';
        graphContainer.style.height = '400px';
        graphContainer.style.margin = '10px 0';
        graphContainer.style.border = '1px solid #ddd';
        graphContainer.style.borderRadius = '4px';
        graphContainer.style.backgroundColor = '#fff';

        // Создаем заголовок
        const graphTitle = document.createElement('div');
        graphTitle.textContent = '📊 Note Graph';
        graphTitle.style.fontWeight = 'bold';
        graphTitle.style.padding = '10px';
        graphTitle.style.borderBottom = '1px solid #ddd';
        graphTitle.style.backgroundColor = '#f5f5f5';

        // Добавляем заголовок и контейнер в сайдбар
        sidebarInner.insertBefore(graphTitle, sidebarInner.firstChild);
        sidebarInner.insertBefore(graphContainer, sidebarInner.firstChild.nextSibling);

        console.log('Graph container created');

        // Собираем данные для графа
        const nodes = new vis.DataSet([]);
        const edges = new vis.DataSet([]);
        const nodeIds = new Set();

        // Получаем текущую страницу
        const currentPath = window.location.pathname;
        let currentPage = currentPath.split('/').pop().replace('.html', '');
        if (!currentPage || currentPage === '') {
            currentPage = 'index';
        }

        console.log('Current page:', currentPage);

        // Добавляем текущую страницу как узел
        nodeIds.add(currentPage);
        nodes.add({
            id: currentPage,
            label: currentPage,
            color: {
                background: '#FF6E42',
                border: '#CC5500',
                highlight: {
                    background: '#FF8C66',
                    border: '#CC5500'
                }
            },
            font: { color: '#fff' }
        });

        // Находим все внутренние ссылки
        const links = document.querySelectorAll('a[href^="./"], a[href^="../"], a[href*=".html"]');
        console.log('Found links:', links.length);

        links.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href) {
                let target = href.split('/').pop().replace('.html', '');
                if (target && target !== currentPage && !target.includes('#')) {
                    if (!nodeIds.has(target)) {
                        nodeIds.add(target);
                        nodes.add({
                            id: target,
                            label: target,
                            color: {
                                background: '#D3D3D3',
                                border: '#A9A9A9',
                                highlight: {
                                    background: '#E0E0E0',
                                    border: '#A9A9A9'
                                }
                            }
                        });
                        console.log('Added node:', target);
                    }
                    edges.add({
                        from: currentPage,
                        to: target,
                        color: { color: '#888888' },
                        arrows: 'to'
                    });
                }
            }
        });

        console.log('Total nodes:', nodes.length);
        console.log('Total edges:', edges.length);

        // Если есть хотя бы один узел кроме текущего
        if (nodes.length > 1) {
            const data = {
                nodes: nodes,
                edges: edges
            };

            const options = {
                nodes: {
                    shape: 'dot',
                    size: 20,
                    font: {
                        size: 12,
                        color: '#000000'
                    },
                    borderWidth: 2,
                    shadow: true
                },
                edges: {
                    width: 1,
                    smooth: {
                        type: 'continuous'
                    }
                },
                physics: {
                    enabled: true,
                    stabilization: {
                        iterations: 100
                    },
                    solver: 'barnesHut'
                },
                interaction: {
                    hover: true,
                    tooltipDelay: 200,
                    hideEdgesOnDrag: true
                }
            };

            try {
                const network = new vis.Network(graphContainer, data, options);
                console.log('Network created successfully');
                
                network.on('click', function(params) {
                    if (params.nodes.length > 0) {
                        const nodeId = params.nodes[0];
                        const links = document.querySelectorAll('a');
                        for (let link of links) {
                            const href = link.getAttribute('href');
                            if (href && href.includes(nodeId)) {
                                link.click();
                                break;
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error creating network:', error);
                graphContainer.innerHTML = 'Error creating graph';
            }
        } else {
            graphContainer.innerHTML = '<div style="padding: 20px; text-align: center;">No connections found</div>';
        }
    }, 1000); // Ждем 1 секунду
});
