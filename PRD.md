📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
Project Name

AI Weekly Report Generator

1️⃣ Project Overview
1.1 Purpose

To build a client-side AI-powered web application that converts structured weekly task inputs (5 days) into a professionally formatted 2–3 page report.

The system will:

Accept structured user inputs

Send a controlled prompt request to Gemini API

Generate strictly derived HTML report content

Allow client-side editing

Enable download as PDF or Word

Store previously generated reports locally (localStorage only)

No backend. No authentication. No database.

1.2 Problem Statement

Intern leads and professionals often need to convert raw weekly updates into structured reports. This process is repetitive and time-consuming.

This tool automates formatting while ensuring:

No fabricated information

No hallucinated achievements

No assumptions

Only derived content from user inputs

2️⃣ Scope Definition
2.1 In Scope

3-page SPA structure

Gemini API integration

Strict prompt control

Editable generated report

PDF export

Word export

localStorage-based report history

2.2 Out of Scope (Strictly Excluded)

Authentication system

Backend server

Database

User accounts

Cloud storage

Analytics dashboard

Multi-template selection

Auto-email sending

File system path control

Role-based access

Regenerate history tracking

3️⃣ Target Users

Intern Leads

Students

Team members generating weekly reports

Professionals preparing structured summaries

4️⃣ Technical Architecture
4.1 Technology Stack

Frontend:

React.js

React Router (for 3-page navigation)

React Quill (for rich text editing)

AI Integration:

Google Gemini API (via fetch request)

Export Libraries:

html2pdf.js (PDF generation)

html-docx-js or docx library (Word export)

Storage:

Browser localStorage

Deployment:

Vercel / Netlify (static hosting)

No backend server required.

5️⃣ Application Structure

This is a Single Page Application (SPA) with 3 main views.

6️⃣ Page-Level Functional Requirements
PAGE 1 – Introduction Page
Purpose

Brief explanation of tool.

Components

Project title

Short description

"Generate Weekly Report" button

"View Past Reports" button

Behavior

Clicking Generate → Navigate to Page 2

Clicking View Past Reports → Navigate to Page 3

No animations required.

PAGE 2 – Input & Report Generation Page
6.2.1 Input Form Fields

Mandatory:

Name

Role

Date Range

Date-wise Task Inputs:

Monday

Tuesday

Wednesday

Thursday

Friday

Optional:

Additional Notes

Validation:

At least one day must have content.

Name and Role cannot be empty.

Blank days must NOT be sent to API.

6.2.2 Generate Report Workflow

When user clicks "Generate Report":

Step 1:

Collect form data.

Remove empty day entries.

Construct structured prompt.

Step 2:

Send fetch POST request to Gemini API.

Step 3:

Gemini returns structured HTML report.

Step 4:

Sanitize response.

Render inside rich text editor (React Quill).

6.2.3 Prompt Control (STRICT)

Gemini prompt must enforce:

No new information.

No fabricated achievements.

No assumptions.

No metrics unless provided.

No generic corporate filler.

No hallucination.

Only restructure provided content.

Output format must be:

HTML only

Tags allowed:

<h1>
<h2>
<p>
<ul>
<li>
<strong>

No markdown allowed.
No explanation text outside report.

6.2.4 Editable Output

Generated HTML loads into React Quill.

User can manually edit.

Editor content becomes final export content.

6.2.5 Export Features
Save as PDF

Use html2pdf.js.

Convert editor content.

Auto-download file.

Browser saves to default Downloads folder.

Note:
File path cannot be programmatically controlled.

Save as Word

Convert HTML to .docx using html-docx-js or docx.

Create Blob.

Trigger download.

Auto-download to default Downloads folder.

6.2.6 Save to Local Storage

When export is triggered:

Store object:

{
id: timestamp,
name,
role,
dateRange,
content (HTML),
createdAt
}

Save inside localStorage array:
"weeklyReports"

PAGE 3 – Past Generated Reports
Purpose

View previously saved reports.

Data Source

localStorage only.

Features

Display report list:

Name

Date range

Created date

On click:

Preview report in read-only mode

Delete option:

Remove from localStorage

No cloud sync.
No editing past report inside history page.

7️⃣ Workflow Diagram (Logical Flow)

User → Page 1
↓
Page 2 → Fill form
↓
Click Generate
↓
Gemini API Request
↓
Receive HTML
↓
Load into Editor
↓
User Edits
↓
Export PDF or Word
↓
Save to localStorage
↓
Visible in Page 3

8️⃣ Data Handling Rules

No data stored on server.

All data stored in browser.

Clearing browser data removes saved reports.

API key must be stored in environment variable.

No sensitive information logging.

9️⃣ Non-Functional Requirements

Performance:

Report generation under 15 seconds.

Security:

No exposed API key in frontend code (use environment variables).

Reliability:

If API fails, show error message.

No app crash.

Usability:

Clean UI.

Minimalistic design.

Clear buttons.

🔟 Error Handling

Empty input → show validation message.

Gemini API error → show retry option.

Export failure → show alert message.

No silent failures.

1️⃣1️⃣ Design Requirements

Professional white theme.

Clean layout similar to story generator.

No heavy animations.

Responsive design (desktop priority).

1️⃣2️⃣ Acceptance Criteria

The project is considered complete if:

✅ User can input weekly data
✅ API generates strictly derived report
✅ Report is editable
✅ PDF download works
✅ Word download works
✅ Reports saved to localStorage
✅ Page 3 displays saved reports
✅ No hallucinated content
✅ No unnecessary features included

1️⃣3️⃣ Constraints

Must be completed in 2 days.

Must remain client-side.

Must not include backend logic.

Must not expand scope.

1️⃣4️⃣ Risks & Mitigation

Risk: Gemini hallucination
Mitigation: Strict prompt rules.

Risk: Large response truncation
Mitigation: Controlled input size.

Risk: Export formatting inconsistency
Mitigation: Simple HTML structure.

1️⃣5️⃣ Deployment Plan

Build locally.

Test:

Generate flow

Edit flow

Export PDF

Export Word

localStorage persistence

Deploy to Vercel.

1️⃣6️⃣ Deliverables

Working hosted application

GitHub repository

Clean README

LinkedIn post summary

Final Confirmation

This PRD strictly follows:

User input → Strict derivation → Editable → Export → Local storage.

No added features.

No expanded scope.

No backend.