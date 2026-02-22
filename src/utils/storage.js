const STORAGE_KEY = 'weeklyReports';

/**
 * Returns the full array of saved reports from localStorage.
 * @returns {Array}
 */
export function getReports() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/**
 * Saves a new report to localStorage.
 * @param {{ name: string, role: string, dateRange: string, content: string }} reportData
 * @returns {object} The saved report object with id and createdAt.
 */
export function saveReport({ name, role, dateRange, content }) {
    const reports = getReports();
    const newReport = {
        id: Date.now().toString(),
        name,
        role,
        dateRange,
        content,
        createdAt: new Date().toISOString(),
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return newReport;
}

/**
 * Deletes a report by id from localStorage.
 * @param {string} id
 */
export function deleteReport(id) {
    const reports = getReports().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}
