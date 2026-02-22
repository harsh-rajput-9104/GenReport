# GenReport — AI Weekly Report Generator

A production-ready, client-side React application that converts structured weekly task notes into a professionally formatted report using the Google Gemini API.

---

## Features

- **AI Report Generation** via Google Gemini 1.5 Flash — strict prompt rules prevent hallucination
- **Editable Output** — generated HTML loads into a rich text editor (React Quill)
- **PDF Export** — `html2pdf.js`, auto-downloads to browser Downloads folder
- **Word Export** — `html-docx-js`, auto-downloads `.docx` to browser Downloads folder
- **Local History** — reports saved to `localStorage` under `weeklyReports` key
- **Past Reports Viewer** — browse, preview, and delete previous reports
- **No backend. No auth. No database.** 100% client-side.

---

## Tech Stack

| Layer        | Technology                     |
|--------------|-------------------------------|
| Frontend     | React 18 + Vite                |
| Routing      | React Router v6                |
| Editor       | React Quill                    |
| AI           | Google Gemini API (fetch)      |
| PDF Export   | html2pdf.js                    |
| Word Export  | html-docx-js + file-saver      |
| Sanitization | DOMPurify                      |
| Storage      | Browser localStorage           |
| Deployment   | Vercel / Netlify (static)      |

---

## Project Structure

```
GenReport/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   └── Header.jsx
    ├── pages/
    │   ├── IntroPage.jsx       # Page 1 — Landing
    │   ├── GeneratePage.jsx    # Page 2 — Input & Generate
    │   └── HistoryPage.jsx     # Page 3 — Past Reports
    ├── services/
    │   ├── gemini.js           # Gemini API integration
    │   └── export.js           # PDF & Word export
    └── utils/
        ├── storage.js          # localStorage CRUD
        ├── sanitize.js         # HTML sanitization
        └── formatDate.js       # Date formatting
```

---

## Installation

### Prerequisites

- Node.js 18+
- npm 9+

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd GenReport

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set your Gemini API key:
# VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in and create an API key
3. Paste the key into your `.env` file

---

## Run Locally

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

---

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder. All assets are static — no server required.

---

## Preview Production Build

```bash
npm run preview
```

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the environment variable in **Project Settings → Environment Variables**:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** your API key
4. Deploy — Vite output directory `dist` is detected automatically

### Netlify

1. Push to GitHub
2. Connect repo in [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable `VITE_GEMINI_API_KEY` in Site Settings → Environment
6. Deploy

---

## Workflow

```
User → Page 1 (Landing)
         ↓ Click "Generate Weekly Report"
       Page 2 → Fill form (Name, Role, Date Range, Mon–Fri tasks, optional notes)
         ↓ Click "Generate Report"
       Gemini API request (strict prompt — no hallucination)
         ↓
       Receive HTML → Sanitize → Load into React Quill editor
         ↓ User edits if needed
       Click "Download PDF" or "Download Word"
         ↓
       File auto-downloads + report saved to localStorage
         ↓
       Visible in Page 3 (Past Reports)
```

---

## Security

- API key stored exclusively in environment variable (`VITE_GEMINI_API_KEY`)
- No secrets hardcoded in source code
- All generated HTML sanitized with DOMPurify before rendering
- No data sent to any custom server

---

## License

MIT
