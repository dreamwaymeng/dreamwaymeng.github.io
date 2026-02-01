# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an academic portfolio website built with Jekyll using the academicpages template. It serves as the personal homepage for Lu Meng (孟璐), a hadron physics researcher at Southeast University. The site is bilingual (English/Chinese) and includes sections for research, group members, talks, teaching, and photos.

## Local Development

### Running the development server

```bash
bundle exec jekyll serve
```

Or with live reload and drafts:

```bash
bundle exec jekyll serve --livereload --drafts
```

The site will be available at `http://127.0.0.1:4000`

Jekyll will automatically rebuild when you modify files.

### Building JavaScript assets

```bash
npm run build:js
```

This minifies and combines jQuery, FitVids, smooth-scroll, INSPIRE-HEP citations module, and custom JavaScript into `assets/js/main.min.js`.

Watch for changes:

```bash
npm run watch:js
```

**Note**: After modifying JavaScript source files in `assets/js/`, you must rebuild the bundle with `npm run build:js` before changes take effect.

### Ruby version management

This project uses Ruby 3.3.0. If you encounter Ruby version issues:

```bash
rbenv install 3.3.0
rbenv global 3.3.0
ruby --version
```

## Architecture

### Jekyll Configuration

- **Main config**: `_config.yml` - site metadata, author profile, collections, plugins
- **Docker config**: `_config_docker.yml` - minimal overrides for Docker
- **Navigation**: `_data/navigation.yml` - header menu structure
- **Localization**: `_data/ui-text.yml` - multilingual UI strings
- **CV data**: `_data/cv.json` - structured CV for JSON-based rendering

### Directory Structure

- **`_pages/`**: Main site pages (about.md, about_zh.md, group_members.md, etc.)
  - Pages use front matter to set permalinks and layouts
  - Chinese pages have `_zh` suffix (e.g., `about_zh.md`)
- **`_layouts/`**: Page templates (single.html, talk.html, cv-layout.html, etc.)
- **`_includes/`**: Reusable HTML components (header, footer, author-profile, etc.)
- **`_sass/`**: SCSS stylesheets organized by component
- **`_data/`**: YAML/JSON data files
- **`assets/`**: Static files (CSS, JS, images)
- **`files/`**: Downloadable files (PDFs, etc.)
- **`images/`**: Image assets

### Collections

Defined in `_config.yml`:

- **publications**: Academic papers and manuscripts
- **talks**: Conference presentations and seminars
- **teaching**: Teaching materials and courses
- **portfolio**: Project showcase

Each collection has `output: true` and uses permalink pattern `/:collection/:path/`.

### Bilingual Support

The site supports English and Chinese:

- Main pages have both `page.md` and `page_zh.md` versions
- Navigation menu (in `_data/navigation.yml`) includes both "About" and "关于我"
- When creating new pages, consider adding both language versions
- Redirects are configured in page front matter using `redirect_from`

### Author Profile

Configured in `_config.yml` under the `author:` section. This controls:

- Name, bio, location, employer
- Profile picture (`avatar: "myprofile.jpg"`)
- Social media links (Google Scholar, ORCID, INSPIRE-HEP, etc.)
- Email and contact information

Changes to author info require Jekyll restart to take effect.

### Page Layouts

- **single**: Default layout for most content pages
- **talk**: Special layout for talks with venue, date, and presentation details
- **cv-layout**: For curriculum vitae pages
- **archive**: For listing collections

### INSPIRE-HEP Citation Summary

The about pages (`about.md` and `about_zh.md`) feature dynamic citation statistics fetched from the INSPIRE-HEP API.

**Implementation:**
- **JavaScript**: `assets/js/inspire-citations.js` - Handles API fetching, metrics calculation, and rendering
- **Styles**: `_sass/layout/_citations.scss` - Responsive grid layout and styling
- **Integration**: `<div id="inspire-citations" data-author-id="1692520" data-lang="en"></div>` in page content

**Features:**
- **Real-time metrics**: Total papers, citations, citations per paper, h-index, highly cited papers (>100 citations)
- **Top journal counts**: Tracks publications in PRL, PRD, Phys.Rept., Sci.Bull., JHEP
- **Bilingual support**: English and Chinese translations with locale-aware date formatting
- **Performance**: 24-hour localStorage caching to minimize API calls
- **Responsive**: 5-column grid on desktop, 3 on tablet, 2 on mobile
- **Data attribution**: Shows "Data from INSPIREHEP" with last updated timestamp

**API Details:**
- Endpoint: `https://inspirehep.net/api/literature?q=a Lu.Meng.1`
- Fields fetched: `citation_count`, `citation_count_without_self_citations`, `publication_info`, `citeable`
- Cache key: `inspire_citations_cache_v3` (increment version to force refresh for all users)

**Modifying the feature:**
1. Edit source file: `assets/js/inspire-citations.js`
2. Rebuild bundle: `npm run build:js`
3. Update cache version if data structure changes
4. Jekyll will auto-regenerate pages on next build

## Common Tasks

### Adding a new page

1. Create file in `_pages/` (e.g., `newpage.md`)
2. Add front matter:
   ```yaml
   ---
   permalink: /newpage/
   title: "Page Title"
   author_profile: true
   ---
   ```
3. Add to navigation in `_data/navigation.yml`:
   ```yaml
   - title: "Page Title"
     url: /newpage/
   ```

### Adding content to collections

Create a file in the appropriate collection directory (e.g., for talks, create `_talks/2024-conference.md`) with proper front matter matching the collection's layout requirements.

### Modifying site metadata

Edit `_config.yml` and restart Jekyll (`bundle exec jekyll serve`).

## Deployment

The site is deployed via GitHub Pages. Push to the `master` branch triggers automatic deployment through GitHub Actions.

## Dependencies

- **Jekyll**: Static site generator
- **github-pages**: GitHub Pages gem bundle
- **Jekyll plugins**: feed, sitemap, redirect-from, jemoji
- **Frontend**: jQuery, FitVids, smooth-scroll
- **APIs**: INSPIRE-HEP Literature API for citation statistics
