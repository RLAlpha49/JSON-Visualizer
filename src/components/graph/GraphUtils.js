export function ConvertJsonToGraph(json, parent = null, nodes = [], edges = [], id = 0) {
    const processItem = (item, index, node, nodes, edges, id) => {
        if (typeof item === 'object' && item !== null) {
            let nodeData = {};
            for (const key in item) {
                if (typeof item[key] !== 'object') {
                    nodeData[key] = item[key];
                }
            }

            const indexNode = {id: id++, data: nodeData, parentId: node.id};
            nodes.push(indexNode);
            edges.push({from: node.id, to: indexNode.id});

            if (typeof item === 'object') {
                id = ConvertJsonToGraph(item, indexNode, nodes, edges, id).id;
            } else {
                const valueNode = {id: id++, data: item, parentId: indexNode.id};
                nodes.push(valueNode);
                edges.push({from: indexNode.id, to: valueNode.id});
            }
        } else {
            const valueNode = {id: id++, data: item, parentId: node.id};
            nodes.push(valueNode);
            edges.push({from: node.id, to: valueNode.id});
        }
        return id;
    };

    if (parent === null) {
        let rootData = {};
        for (const key in json) {
            if (typeof json[key] !== 'object') {
                rootData[key] = json[key];
            }
        }

        const node = {id: id++, data: rootData, parentId: null};
        nodes.push(node);
        parent = node;
    }

    for (const key in json) {
        if (Array.isArray(json[key]) || (typeof json[key] === 'object' && json[key] !== null)) {
            let node;
            if (Array.isArray(json[key])) {
                node = {id: id++, data: `${key} (${json[key].length})`, parentId: parent.id};
                // eslint-disable-next-line no-loop-func
                json[key].forEach((item, index) => {
                    id = processItem(item, index, node, nodes, edges, id, ConvertJsonToGraph);
                });
            } else {
                node = {id: id++, data: key, parentId: parent.id};
                id = ConvertJsonToGraph(json[key], node, nodes, edges, id).id;
            }

            nodes.push(node);
            edges.push({from: parent.id, to: node.id});

            if (typeof json[key] === 'object' && !Array.isArray(json[key]) && json[key] !== null) {
                for (const subKey in json[key]) {
                    if (!Array.isArray(json[key][subKey])) {
                        const subNode = {id: id++, data: {[subKey]: json[key][subKey]}, parentId: node.id};
                        nodes.push(subNode);
                        edges.push({from: node.id, to: subNode.id});
                    }
                }
            }
        }
    }

    return {nodes, edges, id};
}