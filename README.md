# Research Data Dashboard

A lightweight, mobile-first data visualization dashboard for reading and interpreting raw survey CSV data. Built to bridge the gap between messy spreadsheet exports and actionable insights — transforming raw survey responses into interactive charts, heatmaps, and structured analysis without requiring any backend or database.

## The Problem

Research survey data typically comes as raw CSV exports with dozens of columns, coded numeric responses, and no visual context. Manually interpreting 60+ columns across 30+ respondents in a spreadsheet is time-consuming and error-prone.

## The Solution

This dashboard ingests raw CSV survey data and presents it through:

- **Interactive data table** with search, filter, sort, and pagination
- **Statistical overview** — participant count, majors, question count, data points
- **Chart visualizations** — doughnut, bar, radar, scatter, grouped bar
- **Stereotype heatmap** — dimension-by-major cross-analysis
- **Detailed participant profiles** — click any row to see full breakdown
- **Dark/light theme** — system-preference aware

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | CSS Variables, CSS Grid, Flexbox, glassmorphism |
| Logic | Vanilla JavaScript (ES6+ modules) |
| Charts | Chart.js |
| Fonts | Inter, JetBrains Mono |
| Hosting | GitHub Pages (static) |

No build tools. No frameworks. No bundler. Open `index.html` and it works.

## Project Structure

```
WebAnalisisData/
├── index.html              # Single-page application
├── css/
│   └── styles.css          # All styles, CSS variables, responsive rules
├── js/
│   ├── app.js              # Initialization
│   ├── tabs.js             # Section/tab navigation
│   ├── filters.js          # Search, filter, sort, pagination
│   ├── table.js            # Table rendering
│   ├── detail.js           # Participant detail panel
│   ├── charts.js           # Chart.js configurations
│   ├── heatmap.js          # Stereotype heatmap
│   ├── rankings.js         # Rankings visualization
│   ├── animations.js       # Count-up, fade-in
│   └── theme.js            # Dark/light toggle
├── data/
│   └── personas.js         # Participant data (generated from CSV)
└── assets/
    └── images/
```

## Roadmap

### Current

- [x] Static dashboard with 30 participants
- [x] Responsive mobile-first layout
- [x] Glass-card UI with teal accent system
- [x] Interactive charts and heatmap
- [x] Dark/light theme toggle

### Planned

- [ ] **CSV Upload** — drag-and-drop or file picker to load custom CSV data
- [ ] **Auto-detect schema** — map CSV columns to dashboard fields automatically
- [ ] **Before/After normalization view** — toggle between raw CSV values and normalized scores
- [ ] **Export** — download filtered data as CSV or chart as image
- [ ] **Multi-language** — Bahasa Indonesia / English toggle

## Data Format

The dashboard expects CSV with this structure:

| Column | Description |
|--------|------------|
| `ID` | Participant identifier |
| `Nama` | Participant name |
| `Jurusan` | Major/department |
| `Usia` | Age |
| `S1_Q01` – `S1_Q32` | Anxiety scale questions (1–5 Likert) |
| `S2_Q01` – `S2_Q32` | Stereotype scale questions (1–5 Likert) |

Anxiety and stereotype scores are computed as the mean of their respective question groups.

## Quick Start

```bash
# Clone
git clone https://github.com/hyaraxco/dashboard-penelitian-tasyia.git
cd dashboard-penelitian-tasyia/WebAnalisisData

# Open
open index.html
# or
npx serve .
```

No install. No dependencies. No build step.

## License

[MIT](LICENSE)
