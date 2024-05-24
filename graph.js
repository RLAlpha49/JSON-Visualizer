// Initialize CodeMirror
const editor = CodeMirror(document.getElementById('json-input'), {
    lineNumbers: true,
    mode: "application/json",
    theme: "default",
    lineWrapping: true,
});

document.getElementById('graph-button').addEventListener('click', function() {
    const jsonData = editor.getValue();
    try {
        // Clear the SVG container
        document.getElementById('svg-container').innerHTML = '';

        const json = JSON.parse(jsonData);

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
    const maxLineLength = 50;

    if (parent === null) {
        const node = { id: id++, name: 'root', parentId: null };
        nodes.push(node);
        parent = node;
    }

    let combinedNodeContent = '';
    for (const key in json) {
        if (Array.isArray(json[key]) || (typeof json[key] === 'object' && json[key] !== null)) {
            let node;
            if (Array.isArray(json[key])) {
                node = { id: id++, name: `${key} (${json[key].length})`, parentId: parent.id };
                json[key].forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        const indexNode = { id: id++, name: `Index ${index}`, parentId: node.id };
                        nodes.push(indexNode);
                        links.push({ source: node.id, target: indexNode.id });

                        if (typeof item === 'object') {
                            id = convertJsonToGraph(item, indexNode, nodes, links, id).id;
                        } else {
                            const valueNode = { id: id++, name: item, parentId: indexNode.id };
                            nodes.push(valueNode);
                            links.push({ source: indexNode.id, target: valueNode.id });
                        }
                    } else {
                        const valueNode = { id: id++, name: item, parentId: node.id };
                        nodes.push(valueNode);
                        links.push({ source: node.id, target: valueNode.id });
                    }
                });
            } else {
                node = { id: id++, name: key, parentId: parent.id };
                id = convertJsonToGraph(json[key], node, nodes, links, id).id;
            }
            nodes.push(node);
            links.push({ source: parent.id, target: node.id });
        } else {
            // Combine the key and value into one string
            let keyValue = `${key}: ${json[key]}`;

            // Break the keyValue into substrings of maxLineLength and add each substring to combinedNodeContent
            for (let i = 0; i < keyValue.length; i += maxLineLength) {
                combinedNodeContent += keyValue.substring(i, i + maxLineLength) + '\n';
            }
        }
    }

    if (combinedNodeContent !== '') {
        parent.name = combinedNodeContent;
    }

    return { nodes, links, id };
}

function calculateMultiplicationFactor(totalChildren) {
    if (totalChildren > 9000) {
        return 80;
    } else if (totalChildren > 1000) {
        return 60;
    } else if (totalChildren > 100) {
        return 40;
    } else {
        return 30;
    }
}

function createGraph(nodes, links) {
    // Calculate the height and width for the SVG
    const svgHeight = window.innerHeight;
    const svgWidth = window.innerWidth;

    const svg = d3.select('#svg-container').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
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
        .size([calculateMultiplicationFactor(totalChildren) * (totalChildren + 1), (maxDepth + 1) * 400])
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
        .attr('fill', 'white')
        .attr('stroke', '#3f3f46')
        .attr('stroke-width', 1)
        .attr('rx', 5)
        .attr('ry', 5)
        .each(function(d) {
            // Split the name into separate lines
            const lines = d.data.name.split('\n');
            let maxLineWidth = 0;
            let lineHeight = 0;

            // Create a temporary text element to calculate the width of each line
            lines.forEach(line => {
                const tempText = svg.append('text').text(line);
                const lineWidth = tempText.node().getBBox().width;
                lineHeight = tempText.node().getBBox().height;
                tempText.remove();

                // Update maxLineWidth if this line is wider
                if (lineWidth > maxLineWidth) {
                    maxLineWidth = lineWidth;
                }
            });

            // Set the width and height of the rectangle
            const rectWidth = maxLineWidth + 30;
            const rectHeight = lines.length > 1 ? 30 * (lines.length - 1) : 20;
            d3.select(this).attr('width', rectWidth).attr('height', rectHeight);

            // Store the width and height in the data for later use
            d.data.width = rectWidth;
            d.data.height = rectHeight;
        })
        .attr('x', d => d.y + 26.5)
        .attr('y', d => d.x - d.data.height / 2);

    // Create the labels
    const labels = svg.append('g')
        .selectAll('text')
        .data(root.descendants())
        .enter().append('text')
        .attr('dx', 12)
        .attr('x', d => d.y + 20)
        .attr('y', d => {
            const lines = d.data.name.split('\n');
            return lines.length > 1 ? d.x + 15 : d.x + 5;
        })
        .each(function(d) {
            // Split the name into separate lines
            const lines = d.data.name.split('\n');
            const lineHeight = 1.5;
            const totalHeight = lines.length * lineHeight;

            for (let i = 0; i < lines.length; i++) {
                const tspan = d3.select(this).append('tspan')
                    .text(lines[i])
                    .attr('dy', `${i === 0 ? -totalHeight / 2 + lineHeight / 2 : lineHeight}em`);

                if (i === 0) {
                    tspan.attr('x', d => d.y + 30);
                } else if (i > 0) {
                    tspan.attr('x', d => d.y + 42);
                }
            }
        });

    // Create the links
    const link = svg.append('g')
        .selectAll('path')
        .data(root.links())
        .enter().append('path')
        .attr('d', d3.linkHorizontal()
            .source(d => {
                // Ensure d.source.data.width is a number
                const width = isNaN(d.source.data.width) ? 0 : d.source.data.width;
                return [d.source.y + 27 + width, d.source.x];
            })
            .target(d => [d.target.y + 20, d.target.x]))
        .attr('stroke', '#3f3f46')
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');

    let svgContainer = d3.select('#svg-container');

    // Create the zoom behavior
    let zoom = d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform);
    });

    // Apply the zoom behavior to the SVG
    svgContainer.call(zoom);

    // Assume `nodeElement` is the SVG element you want to zoom onto
    let nodeElement = svg.select('#svg-container > svg > g > g:nth-child(2) > rect:nth-child(1)').node();
    // Check if the node element exists
    if (nodeElement) {
        // Get the bounding box of the node
        let bbox = nodeElement.getBBox();

        // Calculate the center of the node
        let y = -(bbox.y * 0.9987);
        if (y > -1000) {
            y = -(y)
        }

        // Create the initial transform
        let initialTransform = d3.zoomIdentity.translate(0, y);

        // Apply the initial transform to the zoom behavior
        svgContainer.call(zoom.transform, initialTransform);
    }
}