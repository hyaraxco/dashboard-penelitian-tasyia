# GitHub Pages CI/CD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the static dashboard to GitHub Pages automatically on every push to `main`, while preserving the custom domain `tasyia.hyarax.works`.

**Architecture:** Use a single GitHub Actions workflow that prepares a clean publish directory containing only the site assets needed by GitHub Pages (`index.html`, `css/`, `js/`, `data/`, `assets/`, `favicon.svg`, `CNAME`). Publish that directory through the Pages deployment action so the repo stays static and has no build dependency.

**Tech Stack:** GitHub Actions, GitHub Pages, shell scripting, static HTML/CSS/JS.

---

### Task 1: Add Pages workflow

**Files:**
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Build site directory
        run: |
          rm -rf site
          mkdir -p site
          rsync -a --delete \
            --exclude '.git' \
            --exclude '.github' \
            --exclude 'docs' \
            --exclude '.superpowers' \
            --exclude 'README.md' \
            --exclude 'LICENSE' \
            ./ site/

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify workflow syntax**

Run: `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/pages.yml") ; puts "YAML OK"'`
Expected: `YAML OK`

- [ ] **Step 3: Commit workflow**

```bash
git add .github/workflows/pages.yml
git commit -m "feat: add github pages deployment workflow"
```

### Task 2: Verify custom domain payload

**Files:**
- Modify: `CNAME` (no content change expected; ensure file is copied into `site/`)

- [ ] **Step 1: Confirm `CNAME` is included in publish directory**

```bash
rm -rf site && mkdir -p site && rsync -a --delete --exclude '.git' --exclude '.github' --exclude 'docs' --exclude '.superpowers' --exclude 'README.md' --exclude 'LICENSE' ./ site/ && test -f site/CNAME && echo "CNAME OK"
```

Expected: `CNAME OK`

- [ ] **Step 2: Verify local static tree still renders**

Run: `python3 -m http.server 8001 --directory site`
Expected: site root serves `index.html` and custom domain file is present in publish tree.

- [ ] **Step 3: Commit any repo metadata changes**

```bash
git add CNAME
git commit -m "chore: keep custom domain for pages deploy"
```
