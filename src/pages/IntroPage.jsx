import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function IntroPage() {
    const navigate = useNavigate();

    return (
        <div className="page-shell">
            <Header />

            <main className="page-content" id="main-content">
                <div className="intro-hero">
                    <p className="eyebrow">AI-Powered · Client-Side · Structured</p>

                    <h1 className="display-title mt-3">
                        Turn your weekly notes<br />
                        into a polished report.
                    </h1>

                    <p className="body-lg mt-5" style={{ maxWidth: '560px' }}>
                        Enter your daily task updates and let Gemini AI format them into a
                        professionals-grade weekly report — editable and exportable as PDF or Word.
                        No account required. Nothing leaves your browser.
                    </p>

                    <div className="intro-actions mt-6">
                        <button
                            id="btn-generate"
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/generate')}
                        >
                            Generate Weekly Report
                        </button>

                        <button
                            id="btn-history"
                            className="btn btn-outline btn-lg"
                            onClick={() => navigate('/history')}
                        >
                            View Past Reports
                        </button>
                    </div>
                </div>

                <div className="intro-features mt-6">
                    <div className="intro-feature-card">
                        <div className="feature-icon" aria-hidden="true">📝</div>
                        <strong>Strict Derivation</strong>
                        <p>No hallucination. No fabricated metrics. Only your words, structured.</p>
                    </div>
                    <div className="intro-feature-card">
                        <div className="feature-icon" aria-hidden="true">✏️</div>
                        <strong>Fully Editable</strong>
                        <p>Review and refine the generated report before downloading.</p>
                    </div>
                    <div className="intro-feature-card">
                        <div className="feature-icon" aria-hidden="true">📁</div>
                        <strong>Export & Save</strong>
                        <p>Download as PDF or Word. All reports saved locally in your browser.</p>
                    </div>
                </div>
            </main>

            <style>{`
        .intro-hero {
          padding: var(--space-8) 0 var(--space-7);
          border-bottom: 1px solid var(--ivory-deep);
        }

        .intro-actions {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .intro-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
          padding: var(--space-6) 0;
        }

        .intro-feature-card {
          background: var(--white);
          border: 1px solid var(--ivory-deep);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .intro-feature-card strong {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--ink);
        }

        .intro-feature-card p {
          font-size: 0.875rem;
          color: var(--ink-muted);
          line-height: 1.55;
        }

        .feature-icon {
          font-size: 1.5rem;
          margin-bottom: var(--space-1);
        }

        .btn-active {
          color: var(--ink);
          background: var(--ivory-mid);
        }

        @media (max-width: 640px) {
          .intro-features {
            grid-template-columns: 1fr;
          }
          .intro-hero {
            padding: var(--space-6) 0 var(--space-5);
          }
        }
      `}</style>
        </div>
    );
}
