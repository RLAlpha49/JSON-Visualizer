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
        let node;
        if (Array.isArray(json[key])) {
            // If the value is an array, create a node for the array itself
            node = { id: id++, name: `${key} (${json[key].length})`, parentId: parent.id };
            nodes.push(node);
            links.push({ source: parent.id, target: node.id });

            // Then create a node for each index of the array
            json[key].forEach((item, index) => {
                const indexNode = { id: id++, name: `Index ${index}`, parentId: node.id };
                nodes.push(indexNode);
                links.push({ source: node.id, target: indexNode.id });

                if (typeof item === 'object' && item !== null) {
                    id = convertJsonToGraph(item, indexNode, nodes, links, id).id;
                } else {
                    // Create a node for the value and link it to the index
                    const valueNode = { id: id++, name: item, parentId: indexNode.id };
                    nodes.push(valueNode);
                    links.push({ source: indexNode.id, target: valueNode.id });
                }
            });
        } else {
            node = { id: id++, name: key, parentId: parent.id };
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
    const treeLayout = d3.tree()
        .size([(totalChildren + 1) * 20, (maxDepth + 1) * 300])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
    treeLayout(root);

    // Log the size of the tree layout
    //console.log(treeLayout.size());

    // Define the arrowhead marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#3f3f46')
        .style('stroke','none');

    // Create the nodes
    const node = svg.append('g')
        .selectAll('rect')
        .data(root.descendants())
        .enter().append('rect')
        .attr('height', 20) // height of the rectangle
        .attr('fill', 'white') // color of the rectangle
        .attr('stroke', '#3f3f46') // color of the outline
        .attr('stroke-width', 1) // width of the outline
        .attr('rx', 5) // horizontal radius of the corners
        .attr('ry', 5) // vertical radius of the corners
        .each(function(d) {
            // Create a temporary text element to calculate the width of the text
            const tempText = svg.append('text').text(d.data.name);
            const textWidth = tempText.node().getBBox().width;
            tempText.remove();

            // Set the width of the rectangle to be slightly larger than the text
            const rectWidth = textWidth + 10;
            d3.select(this).attr('width', rectWidth);

            // Store the width in the data for later use
            d.data.width = rectWidth;
        })
        .attr('x', d => d.y + 26.5)
        .attr('y', d => d.x - 10);

    // Create the labels
    const labels = svg.append('g')
        .selectAll('text')
        .data(root.descendants())
        .enter().append('text')
        .text(d => d.data.name)
        .attr('dx', 12)
        .attr('dy', '.35em')
        .attr('x', d => d.y + 20)
        .attr('y', d => d.x);

    // Create the links
    const link = svg.append('g')
        .selectAll('path')
        .data(root.links())
        .enter().append('path')
        .attr('d', d3.linkHorizontal()
            .source(d => [d.source.y + 27 + d.source.data.width, d.source.x])
            .target(d => [d.target.y + 20, d.target.x]))
        .attr('stroke', '#3f3f46')
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)'); // Add the arrowhead marker

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