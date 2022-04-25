// SWAPI response includes resource URIs instead of IDs,
// which we need to parse to build good-looking links.

interface RegexNamedGroupResult {
    groups: {
        id: number
    };
}

const extractIdFromResourceUriRegex = /.*\/(?<id>[0-9]+)/;

export const extractIdFromResourceUri = function (uri: string): number {
    // Regular expression typescript support is pretty bad,
    return ((extractIdFromResourceUriRegex.exec(uri) as unknown) as RegexNamedGroupResult).groups.id;
}

export default {
    extractIdFromResourceUri
}