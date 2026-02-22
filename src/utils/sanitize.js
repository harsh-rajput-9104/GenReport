import DOMPurify from 'dompurify';

/**
 * Strips all HTML tags except the allowed set specified in the PRD:
 * h1, h2, p, ul, li, strong
 * Then sanitizes with DOMPurify.
 * @param {string} rawHtml
 * @returns {string}
 */
export function sanitizeReportHtml(rawHtml) {
    if (!rawHtml || typeof rawHtml !== 'string') return '';

    const clean = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ['h1', 'h2', 'p', 'ul', 'ol', 'li', 'strong', 'br'],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
    });

    return clean;
}
