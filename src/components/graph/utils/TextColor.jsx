export function getColorBasedOnNodeType(type) {
    let color;
    switch (type) {
        case 'root':
        case 'data':
            color = 'white';
            break;
        case 'property-object':
            color = '#9cdcfe';
            break;
        case 'property-array':
            color = 'orange';
            break;
        default:
            color = 'white';
    }
    return color;
}

export function getColorBasedOnType(value) {
    let color;
    switch (typeof value) {
        case 'string':
        case 'undefined':
            color = 'white';
            break;
        case 'number':
            color = '#f0e98f';
            break;
        case 'boolean':
            color = '#24d38c';
            break;
        default:
            color = 'white';
    }
    return color;
}