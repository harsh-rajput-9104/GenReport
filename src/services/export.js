/**
 * Exports the given HTML content as a PDF file using html2pdf.js.
 * Dynamically imported to keep initial bundle lean.
 *
 * @param {string} htmlContent - The editor HTML content
 * @param {string} filename - Output filename without extension
 */
export async function exportPdf(htmlContent, filename = 'weekly-report') {
  const html2pdf = (await import('html2pdf.js')).default;

  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  element.style.fontFamily = "'DM Sans', Helvetica, sans-serif";
  element.style.fontSize = '13px';
  element.style.lineHeight = '1.75';
  element.style.color = '#0e0e0e';

  const opt = {
    margin: [15, 15, 15, 15],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  await html2pdf().set(opt).from(element).save();
}

/**
 * Loads html-docx-js from CDN (avoids CommonJS bundler incompatibility).
 * Returns the htmlDocx object.
 */
function loadHtmlDocxFromCdn() {
  return new Promise((resolve, reject) => {
    if (window.htmlDocx) {
      resolve(window.htmlDocx);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js';
    script.onload = () => {
      if (window.htmlDocx) {
        resolve(window.htmlDocx);
      } else {
        reject(new Error('html-docx-js failed to load from CDN.'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load html-docx-js from CDN. Check your network connection.'));
    document.head.appendChild(script);
  });
}

/**
 * Exports the given HTML content as a .docx Word file.
 * Uses html-docx-js loaded from CDN.
 *
 * @param {string} htmlContent - The editor HTML content
 * @param {string} filename - Output filename without extension
 */
export async function exportWord(htmlContent, filename = 'weekly-report') {
  const htmlDocx = await loadHtmlDocxFromCdn();

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Calibri, sans-serif;
      font-size: 12pt;
      color: #0e0e0e;
      line-height: 1.6;
      margin: 20mm;
    }
    h1 {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 10pt;
    }
    h2 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 14pt;
      margin-bottom: 6pt;
      border-bottom: 1pt solid #ccc;
      padding-bottom: 4pt;
    }
    p { margin-bottom: 8pt; }
    ul { margin-left: 20pt; margin-bottom: 8pt; }
    li { margin-bottom: 4pt; }
    strong { font-weight: bold; }
  </style>
</head>
<body>${htmlContent}</body>
</html>`;

  const blob = htmlDocx.asBlob(fullHtml);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.docx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
