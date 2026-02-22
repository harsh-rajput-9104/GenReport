import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getReports, deleteReport } from '../utils/storage';
import { formatDate } from '../utils/formatDate';

export default function HistoryPage() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [previewReport, setPreviewReport] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        setReports(getReports());
    }, []);

    const handleDelete = (id) => {
        deleteReport(id);
        const updated = getReports();
        setReports(updated);
        if (previewReport?.id === id) {
            setPreviewReport(null);
        }
        setDeleteTarget(null);
    };

    const handlePreview = (report) => {
        setPreviewReport(report);
        setTimeout(() => {
            document.getElementById('report-preview-panel')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 80);
    };

    return (
        <div className="page-shell">
            <Header />

            <main className="page-content wide" id="main-content">
                {/* Page header */}
                <div className="history-page-header">
                    <div>
                        <p className="eyebrow">Saved Locally · Browser Only</p>
                        <h1 className="section-title mt-2">Past Generated Reports</h1>
                        <p className="body-sm mt-2">
                            {reports.length === 0
                                ? 'No reports saved yet.'
                                : `${reports.length} report${reports.length > 1 ? 's' : ''} saved in your browser.`}
                        </p>
                    </div>

                    <button
                        id="btn-new-report"
                        className="btn btn-primary"
                        onClick={() => navigate('/generate')}
                    >
                        New Report
                    </button>
                </div>

                {reports.length === 0 ? (
                    <div className="empty-state mt-6">
                        <div className="empty-icon" aria-hidden="true">📄</div>
                        <h2 className="section-title mt-4">No reports yet</h2>
                        <p className="body-lg mt-3">
                            Generate your first weekly report and export it — it will appear here.
                        </p>
                        <button
                            id="btn-go-generate"
                            className="btn btn-ember mt-5"
                            onClick={() => navigate('/generate')}
                        >
                            Generate a Report
                        </button>
                    </div>
                ) : (
                    <div className="history-layout mt-6">
                        {/* Report list */}
                        <div className="history-list">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className={`history-card${previewReport?.id === report.id ? ' active' : ''}`}
                                >
                                    <button
                                        className="history-card-body"
                                        onClick={() => handlePreview(report)}
                                        aria-pressed={previewReport?.id === report.id}
                                        id={`report-item-${report.id}`}
                                    >
                                        <div className="history-card-meta">
                                            <span className="history-name">{report.name}</span>
                                            <span className="history-role">{report.role}</span>
                                        </div>
                                        <div className="history-card-dates">
                                            <span className="history-date-range">{report.dateRange}</span>
                                            <span className="history-created">
                                                Saved {formatDate(report.createdAt)}
                                            </span>
                                        </div>
                                    </button>

                                    <div className="history-card-actions">
                                        {deleteTarget === report.id ? (
                                            <>
                                                <span className="body-sm" style={{ color: 'var(--danger)' }}>
                                                    Confirm delete?
                                                </span>
                                                <button
                                                    id={`btn-confirm-delete-${report.id}`}
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(report.id)}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    id={`btn-cancel-delete-${report.id}`}
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => setDeleteTarget(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                id={`btn-delete-${report.id}`}
                                                className="btn btn-danger btn-sm"
                                                onClick={() => setDeleteTarget(report.id)}
                                                aria-label={`Delete report for ${report.name}`}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preview panel */}
                        {previewReport && (
                            <div className="history-preview" id="report-preview-panel" role="region" aria-label="Report preview">
                                <div className="preview-header">
                                    <div>
                                        <p className="eyebrow">Preview</p>
                                        <h2 className="section-title mt-1">{previewReport.name}</h2>
                                        <p className="body-sm mt-1">
                                            {previewReport.role} · {previewReport.dateRange}
                                        </p>
                                    </div>
                                    <button
                                        id="btn-close-preview"
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => setPreviewReport(null)}
                                        aria-label="Close preview"
                                    >
                                        ✕ Close
                                    </button>
                                </div>

                                <div
                                    className="preview-content"
                                    dangerouslySetInnerHTML={{ __html: previewReport.content }}
                                    aria-readonly="true"
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>

            <style>{`
        .history-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
          padding-bottom: var(--space-5);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-9) var(--space-6);
          background: var(--white);
          border: 1px solid var(--ivory-deep);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-icon {
          font-size: 3rem;
        }

        .history-layout {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: var(--space-5);
          align-items: start;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .history-card {
          background: var(--white);
          border: 1.5px solid var(--ivory-deep);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color var(--dur-norm) var(--ease), box-shadow var(--dur-norm) var(--ease);
        }

        .history-card:hover {
          border-color: var(--ember-dim);
          box-shadow: var(--shadow-sm);
        }

        .history-card.active {
          border-color: var(--ember);
          box-shadow: 0 0 0 3px rgba(200,134,42,0.12);
        }

        .history-card-body {
          display: block;
          width: 100%;
          text-align: left;
          padding: var(--space-4) var(--space-5);
          background: none;
          border: none;
          cursor: pointer;
        }

        .history-card-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: var(--space-2);
        }

        .history-name {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--ink);
        }

        .history-role {
          font-size: 0.8125rem;
          color: var(--ink-muted);
        }

        .history-card-dates {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .history-date-range {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--ember-dim);
          background: rgba(200,134,42,0.08);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
        }

        .history-created {
          font-size: 0.75rem;
          color: var(--ink-muted);
        }

        .history-card-actions {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-5) var(--space-3);
          border-top: 1px solid var(--ivory-deep);
          background: var(--ivory);
          flex-wrap: wrap;
        }

        .history-preview {
          background: var(--white);
          border: 1px solid var(--ivory-deep);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          position: sticky;
          top: calc(64px + var(--space-5));
          max-height: calc(100vh - 100px);
          overflow-y: auto;
        }

        .preview-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4);
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--ivory-deep);
          background: var(--ivory);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .preview-content {
          padding: var(--space-6);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--ink);
          line-height: 1.75;
        }

        .preview-content h1 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: var(--space-3);
          letter-spacing: -0.02em;
        }

        .preview-content h2 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--ink-soft);
          margin-top: var(--space-5);
          margin-bottom: var(--space-2);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--ivory-deep);
        }

        .preview-content p {
          color: var(--ink-muted);
          margin-bottom: var(--space-3);
        }

        .preview-content ul,
        .preview-content ol {
          padding-left: var(--space-5);
          margin-bottom: var(--space-3);
        }

        .preview-content li {
          color: var(--ink-muted);
          margin-bottom: var(--space-1);
        }

        .preview-content strong {
          color: var(--ink);
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .history-layout {
            grid-template-columns: 1fr;
          }
          .history-preview {
            position: static;
            max-height: none;
          }
        }
      `}</style>
        </div>
    );
}
