/**
 * Formats a date-time ISO string into a readable local date.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
