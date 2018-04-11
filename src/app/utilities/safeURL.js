/**
 * Makaes a safe URL by removing non a-z and 0-9 characters, replacing them with an '_'
 * 
 * @param {string} - String of proposed URL or URL part
 * @returns {string}
 */

export default function safeURL(url) {
    const safeURL = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return encodeURIComponent(safeURL);
}