# Research Survey Dashboard

A mobile-first data visualization dashboard for interpreting raw survey CSV data. Designed to transform Likert-scale survey exports into interactive charts, heatmaps, and structured analysis — no backend, no database, no build step.

## Purpose

This dashboard serves as a companion tool for quantitative research on gender dynamics in Indonesian engineering education. It reads raw survey responses (Likert scale 1–5) and presents them through visualizations that make pattern recognition and interpretation significantly easier than scanning rows in a spreadsheet.

The research context focuses on understanding how gender stereotypes correlate with career anxiety among female engineering students in Indonesia, across departments with varying gender ratios.

## What It Does

- **Ingests raw CSV survey data** — numeric Likert responses across multiple psychological scales
- **Computes scale scores** — averages anxiety and stereotype dimensions per respondent
- **Visualizes patterns** — doughnut distributions, bar comparisons, radar profiles, scatter plots, heatmaps
- **Enables exploration** — search, filter by department/anxiety level/stereotype level, sort, paginate
- **Shows individual profiles** — click any row for a full respondent breakdown
- **Adapts to screen** — responsive from mobile to desktop with dark/light theme

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | CSS Variables, CSS Grid, Flexbox |
| Logic | Vanilla JavaScript (ES6 modules) |
| Charts | Chart.js |
| Hosting | GitHub Pages (static) |

Zero dependencies. Zero build tools. Open `index.html` and it works.

## Project Structure

```
WebAnalisisData/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js
│   ├── tabs.js
│   ├── filters.js
│   ├── table.js
│   ├── detail.js
│   ├── charts.js
│   ├── heatmap.js
│   ├── rankings.js
│   ├── animations.js
│   └── theme.js
├── data/personas.js
└── assets/images/
```

## Roadmap

**Now**
- Static dashboard with survey data
- Responsive mobile-first layout
- Interactive charts and heatmap
- Dark/light theme

**Next**
- [ ] CSV upload — drag-and-drop to load custom survey data
- [ ] Auto schema detection — map CSV columns to dashboard fields
- [ ] Raw vs. normalized toggle — switch between original responses and computed scores
- [ ] Export — filtered data as CSV, charts as images

## Quick Start

```bash
git clone https://github.com/hyaraxco/dashboard-penelitian-tasyia.git
cd dashboard-penelitian-tasyia/WebAnalisisData
open index.html
```

## License

[MIT](LICENSE)
