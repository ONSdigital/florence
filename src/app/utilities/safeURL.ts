/**
 * Makes a safe URL by removing non a-z and 0-9 characters, replacing them with an '_'
 * 
 * @param {string} - URL or URL part to be checked and made safe
 * @returns {string} - The safe version of the URL argument
 */

export default function safeURL(url: string) {
    const safeURL = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return encodeURIComponent(safeURL);
}