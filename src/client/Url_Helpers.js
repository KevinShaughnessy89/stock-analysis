function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        try {
        new URL('https://${string}');
        return true;
        } catch (error) {
        return false;
        }
    }
}

export function normalizeUrl(string) {
    if (isValidUrl(string)) {
        try {
            new URL(string);
            return string;
        } catch (error) {
            return `https://${string}`;
        }
    }
    throw new Error('Invalid URL');
}