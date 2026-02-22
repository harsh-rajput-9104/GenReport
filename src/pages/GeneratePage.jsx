import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '../components/Header';
import { generateReport } from '../services/gemini';
import { exportPdf, exportWord } from '../services/export';
import { saveReport } from '../utils/storage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold'],
        [{ list: 'bullet' }],
        ['clean'],
    ],
};

const QUILL_FORMATS = ['header', 'bold', 'list', 'bullet'];

function validate({ name, role, dateRange, tasks }) {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!role.trim()) errors.role = 'Role is required.';
    if (!dateRange.trim()) errors.dateRange = 'Date range is required.';

    const hasAtLeastOneDay = DAYS.some((day) => tasks[day]?.trim());
    if (!hasAtLeastOneDay) {
        errors.tasks = 'At least one day must have task content.';
    }

    return errors;
}

export default function GeneratePage() {
    const navigate = useNavigate();

    // Form state
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [tasks, setTasks] = useState(
        DAYS.reduce((acc, d) => ({ ...acc, [d]: '' }), {})
    );
    const [additionalNotes, setAdditionalNotes] = useState('');

    // UI state
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [exportError, setExportError] = useState('');
    const [exportSuccess, setExportSuccess] = useState('');

    // Editor state
    const [editorHtml, setEditorHtml] = useState('');
    const [reportGenerated, setReportGenerated] = useState(false);

    const editorRef = useRef(null);
    const editorSectionRef = useRef(null);

    const handleTaskChange = useCallback((day, value) => {
        setTasks((prev) => ({ ...prev, [day]: value }));
    }, []);

    const handleGenerate = async () => {
        setApiError('');
        setExportError('');
        setExportSuccess('');

        const validationErrors = validate({ name, role, dateRange, tasks });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        // Remove blank days before sending to API
        const activeDays = DAYS
            .filter((day) => tasks[day]?.trim())
            .map((day) => ({ day, tasks: tasks[day] }));

        setIsLoading(true);
        try {
            const html = await generateReport({
                name: name.trim(),
                role: role.trim(),
                dateRange: dateRange.trim(),
                days: activeDays,
                additionalNotes,
            });

            setEditorHtml(html);
            setReportGenerated(true);

            // Scroll to editor
            setTimeout(() => {
                editorSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err) {
            setApiError(err.message || 'Failed to generate report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getFilename = () => {
        const safeName = name.trim().replace(/\s+/g, '-').toLowerCase() || 'report';
        const safeRange = dateRange.trim().replace(/\s+/g, '-').replace(/[/\\]/g, '-') || 'week';
        return `${safeName}-${safeRange}`;
    };

    const handleSaveAndExport = useCallback(
        async (type) => {
            setExportError('');
            setExportSuccess('');

            const content = editorHtml;
            if (!content || content === '<p><br></p>' || content === '<p></p>') {
                setExportError('The report content is empty. Please generate a report first.');
                return;
            }

            try {
                const filename = getFilename();

                if (type === 'pdf') {
                    await exportPdf(content, filename);
                } else {
                    await exportWord(content, filename);
                }

                // Save to localStorage after successful export
                saveReport({
                    name: name.trim(),
                    role: role.trim(),
                    dateRange: dateRange.trim(),
                    content,
                });

                setExportSuccess(`Report saved and downloaded as ${type.toUpperCase()}.`);
            } catch (err) {
                setExportError(`Export failed: ${err.message || 'Unknown error. Please try again.'}`);
            }
        },
        [editorHtml, name, role, dateRange]
    );

    return (
        <div className="page-shell">
            <Header />

            <main className="page-content" id="main-content">
                {/* Page title */}
                <div className="generate-page-header">
                    <p className="eyebrow">Step 1 — Fill in your week</p>
                    <h1 className="section-title mt-2">Generate Weekly Report</h1>
                    <p className="body-sm mt-2">
                        All fields marked <span style={{ color: 'var(--ember)' }}>*</span> are required.
                        Only the days you fill in will be included.
                    </p>
                </div>

                {/* Input Form */}
                <form
                    className="generate-form card mt-5"
                    onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}
                    noValidate
                >
                    {/* Meta fields */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="field-name" className="form-label">
                                Name <span className="required">*</span>
                            </label>
                            <input
                                id="field-name"
                                type="text"
                                className={`form-input${errors.name ? ' error' : ''}`}
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="field-role" className="form-label">
                                Role <span className="required">*</span>
                            </label>
                            <input
                                id="field-role"
                                type="text"
                                className={`form-input${errors.role ? ' error' : ''}`}
                                placeholder="e.g. Software Engineering Intern"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            {errors.role && <span className="form-error">{errors.role}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="field-date-range" className="form-label">
                                Date Range <span className="required">*</span>
                            </label>
                            <input
                                id="field-date-range"
                                type="text"
                                className={`form-input${errors.dateRange ? ' error' : ''}`}
                                placeholder="e.g. Feb 17–21, 2026"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            />
                            {errors.dateRange && <span className="form-error">{errors.dateRange}</span>}
                        </div>
                    </div>

                    <div className="divider" />

                    {/* Daily tasks */}
                    <div className="days-label-row">
                        <p className="eyebrow">Daily Task Notes</p>
                        <p className="body-sm">Leave a day blank to exclude it from the report.</p>
                    </div>

                    {errors.tasks && (
                        <div className="alert alert-error mt-3" role="alert">
                            {errors.tasks}
                        </div>
                    )}

                    <div className="days-grid mt-4">
                        {DAYS.map((day) => (
                            <div key={day} className="form-group">
                                <label htmlFor={`field-${day.toLowerCase()}`} className="form-label">
                                    {day}
                                </label>
                                <textarea
                                    id={`field-${day.toLowerCase()}`}
                                    className="form-textarea"
                                    placeholder={`What did you work on ${day}?`}
                                    value={tasks[day]}
                                    onChange={(e) => handleTaskChange(day, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="divider" />

                    {/* Additional notes */}
                    <div className="form-group">
                        <label htmlFor="field-notes" className="form-label">
                            Additional Notes <span style={{ color: 'var(--ink-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}>(optional)</span>
                        </label>
                        <textarea
                            id="field-notes"
                            className="form-textarea"
                            placeholder="Any context you want included — blockers, highlights, upcoming work…"
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                        />
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="alert alert-error mt-4" role="alert">
                            <span>⚠</span>
                            <span>{apiError}</span>
                        </div>
                    )}

                    {/* Generate button */}
                    <div className="generate-btn-row mt-5">
                        <button
                            id="btn-generate-report"
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loader-ring" aria-hidden="true" />
                                    Generating…
                                </>
                            ) : (
                                'Generate Report'
                            )}
                        </button>

                        {isLoading && (
                            <p className="body-sm" style={{ color: 'var(--ink-muted)' }}>
                                Contacting Gemini AI — this may take up to 15 seconds.
                            </p>
                        )}
                    </div>
                </form>

                {/* Editor Section */}
                {reportGenerated && (
                    <div ref={editorSectionRef} className="editor-section mt-6">
                        <div className="editor-header">
                            <div>
                                <p className="eyebrow">Step 2 — Review &amp; Edit</p>
                                <h2 className="section-title mt-2">Edit Your Report</h2>
                                <p className="body-sm mt-2">
                                    Review the AI-formatted report. Make any edits you need before exporting.
                                </p>
                            </div>
                        </div>

                        <div className="editor-wrapper mt-4">
                            <ReactQuill
                                ref={editorRef}
                                value={editorHtml}
                                onChange={setEditorHtml}
                                modules={QUILL_MODULES}
                                formats={QUILL_FORMATS}
                                theme="snow"
                                id="report-editor"
                            />
                        </div>

                        {/* Export feedback */}
                        {exportError && (
                            <div className="alert alert-error mt-4" role="alert">
                                <span>⚠</span>
                                <span>{exportError}</span>
                            </div>
                        )}
                        {exportSuccess && (
                            <div className="alert alert-success mt-4" role="status">
                                <span>✓</span>
                                <span>{exportSuccess}</span>
                            </div>
                        )}

                        {/* Export controls */}
                        <div className="export-row mt-5">
                            <div className="export-info">
                                <p className="eyebrow">Step 3 — Export</p>
                                <p className="body-sm mt-2">
                                    Exporting saves the report to your browser history automatically.
                                </p>
                            </div>
                            <div className="export-buttons">
                                <button
                                    id="btn-export-pdf"
                                    className="btn btn-primary"
                                    onClick={() => handleSaveAndExport('pdf')}
                                >
                                    Download PDF
                                </button>
                                <button
                                    id="btn-export-word"
                                    className="btn btn-outline"
                                    onClick={() => handleSaveAndExport('word')}
                                >
                                    Download Word
                                </button>
                                <button
                                    id="btn-view-history"
                                    className="btn btn-ghost"
                                    onClick={() => navigate('/history')}
                                >
                                    View History
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
        .generate-page-header {
          padding-bottom: var(--space-5);
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }

        .days-label-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-5);
        }

        .generate-btn-row {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .editor-section {
          border-top: 1px solid var(--ivory-deep);
          padding-top: var(--space-6);
        }

        .editor-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .editor-wrapper {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .export-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-5);
          flex-wrap: wrap;
          background: var(--white);
          border: 1px solid var(--ivory-deep);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          box-shadow: var(--shadow-sm);
        }

        .export-buttons {
          display: flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          align-items: center;
        }

        @media (max-width: 768px) {
          .form-row-3 {
            grid-template-columns: 1fr;
          }
          .days-grid {
            grid-template-columns: 1fr;
          }
          .export-row {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
}
