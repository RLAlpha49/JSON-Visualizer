// graph.js
document.getElementById('graph-button').addEventListener('click', function() {
    const input = document.getElementById('json-input').value;
    try {
        const json = JSON.parse(input);

        // Convert the JSON into nodes and links
        const { nodes, links } = convertJsonToGraph(json);

        // Log the nodes and links
        console.log('Nodes:', nodes);
        console.log('Links:', links);

        // Create the graph
        createGraph(nodes, links);
    } catch (error) {
        console.log(error);
    }
});

function convertJsonToGraph(json, parent = null, nodes = [], links = [], id = 0) {
    if (parent === null) {
        // If there's no parent, this is the root node
        const node = { id: id++, name: 'root', parentId: null };
        nodes.push(node);
        parent = node;
    }

    for (const key in json) {
        const node = { id: id++, name: key, parentId: parent.id };
        nodes.push(node);
        links.push({ source: parent.id, target: node.id });

        if (typeof json[key] === 'object' && json[key] !== null) {
            id = convertJsonToGraph(json[key], node, nodes, links, id).id;
        } else {
            // Create a node for the value and link it to the key
            const valueNode = { id: id++, name: json[key], parentId: node.id };
            nodes.push(valueNode);
            links.push({ source: node.id, target: valueNode.id });
        }
    }

    return { nodes, links, id };
}

function createGraph(nodes, links) {
    // Calculate the total height of other elements
    const otherElementsHeight = document.getElementById('json-input').offsetHeight +
                                document.getElementById('graph-button').offsetHeight;

    // Calculate the height and width for the SVG
    const svgHeight = window.innerHeight - otherElementsHeight;
    const svgWidth = window.innerWidth;

    const svg = d3.select('body').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append('g');

    // Create a root for the tree layout
    const root = d3.stratify()
        .id(d => d.id)
        .parentId(d => d.parentId)(nodes);

    // Calculate the maximum depth of the tree
    const maxDepth = d3.max(root.descendants(), d => d.depth);

    // Calculate the total number of children in the tree
    const totalChildren = d3.sum(root.descendants(), d => d.children ? d.children.length : 0);

    // Create the tree layout with size proportional to the total number of children and maximum depth
    const treeLayout = d3.tree().size([(totalChildren + 1) * 10, (maxDepth + 1) * 240]);
    treeLayout(root);

    // Log the size of the tree layout
    console.log(treeLayout.size());

    // Create the links
    const link = svg.append('g')
        .selectAll('line')
        .data(root.links())
        .enter().append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('x1', d => d.source.y)
        .attr('y1', d => d.source.x)
        .attr('x2', d => d.target.y)
        .attr('y2', d => d.target.x);

    // Create the nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(root.descendants())
        .enter().append('circle')
        .attr('r', 5)
        .attr('fill', '#69b3a2')
        .attr('cx', d => d.y)
        .attr('cy', d => d.x);

    // Create the labels
    const labels = svg.append('g')
        .selectAll('text')
        .data(root.descendants())
        .enter().append('text')
        .text(d => d.data.name)
        .attr('dx', 12)
        .attr('dy', '.35em')
        .attr('x', d => d.y)
        .attr('y', d => d.x);

    // Attach a zoom event to the SVG
    svg.call(d3.zoom().on("zoom", function () {
        requestAnimationFrame(() => {
            svg.attr("transform", d3.event.transform);

            // Check if any nodes have come into view and render them if necessary
            node.each(function(d) {
                const circle = d3.select(this);
                const transform = d3.zoomTransform(svg.node());
                const isVisible = (transform.applyY(d.x) > 0 && transform.applyY(d.x) < svgHeight) &&
                    (transform.applyX(d.y) > 0 && transform.applyX(d.y) < svgWidth);

                if (isVisible && circle.attr('fill') === '#69b3a2') {
                    // The node is visible and has not been rendered yet, so render it
                    circle.attr('fill', '#69b3a2');
                    labels.filter(label => label === d).attr('opacity', 1);
                    link.filter(l => l.source === d || l.target === d).attr('stroke-opacity', 0.6);
                }
            });
        });
    }));
}