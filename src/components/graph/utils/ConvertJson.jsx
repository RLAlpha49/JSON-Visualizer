export function ConvertJsonToGraph(json, parent = null, nodes = [], edges = [], id = 0, path = '{Root}') {
    const processItem = (item, index, node, nodes, edges, id, path) => {
        const newPath = `${path}[${index}]`;
        if (typeof item === 'object' && item !== null) {
            let nodeData = {};
            for (const key in item) {
                if (typeof item[key] !== 'object') {
                    nodeData[key] = item[key];
                }
            }

            const indexNode = {
                id: id++,
                data: nodeData,
                parentId: node.id,
                type: 'data',
                path: newPath,
                connectedNodeIds: []
            };
            nodes.push(indexNode);
            edges.push({from: node.id, to: indexNode.id});
            node.connectedNodeIds.push(indexNode.id);

            if (typeof item === 'object') {
                const result = ConvertJsonToGraph(item, indexNode, nodes, edges, id, newPath);
                id = result.id;
            } else {
                const valueNode = {id: id++, data: item, parentId: indexNode.id, type: 'data', path: newPath};
                nodes.push(valueNode);
                edges.push({from: indexNode.id, to: valueNode.id});
                indexNode.connectedNodeIds.push(valueNode.id);
            }
        } else {
            const valueNode = {id: id++, data: item, parentId: node.id, type: 'data', path: newPath};
            nodes.push(valueNode);
            edges.push({from: node.id, to: valueNode.id});
            node.connectedNodeIds.push(valueNode.id);
        }
        return {id};
    };

    if (parent === null) {
        let rootData = {};
        for (const key in json) {
            if (typeof json[key] !== 'object') {
                rootData[key] = json[key];
            }
        }

        const node = {
            id: id++,
            data: rootData,
            parentId: null,
            type: 'root',
            path,
            connectedNodeIds: [],
        };
        nodes.push(node);
        parent = node;
    }

    for (const key in json) {
        const newPath = `${path}.${key}`;
        if (Array.isArray(json[key]) || (typeof json[key] === 'object' && json[key] !== null)) {
            let node;
            if (Array.isArray(json[key])) {
                node = {
                    id: id++,
                    data: `${key} (${json[key].length})`,
                    parentId: parent.id,
                    type: 'property-array',
                    path: newPath,
                    connectedNodeIds: [],
                };
                json[key].forEach((item, index) => {
                    const result = processItem(item, index, node, nodes, edges, id, newPath);
                    id = result.id;
                });
            } else {
                node = {
                    id: id++,
                    data: key,
                    parentId: parent.id,
                    type: 'property-object',
                    path: newPath,
                    connectedNodeIds: [],
                };
                const result = ConvertJsonToGraph(json[key], node, nodes, edges, id, newPath);
                id = result.id;
            }

            nodes.push(node);
            edges.push({from: parent.id, to: node.id});
            parent.connectedNodeIds.push(node.id);

            if (typeof json[key] === 'object' && !Array.isArray(json[key]) && json[key] !== null) {
                for (const subKey in json[key]) {
                    if (!Array.isArray(json[key][subKey])) {
                        const subNode = {
                            id: id++,
                            data: {[subKey]: json[key][subKey]},
                            parentId: node.id,
                            type: 'data',
                            path: `${newPath}.${subKey}`,
                            connectedNodeIds: [],
                        };
                        nodes.push(subNode);
                        edges.push({from: node.id, to: subNode.id});
                        node.connectedNodeIds.push(subNode.id);
                    }
                }
            }
        }
    }

    return {nodes, edges, id};
}