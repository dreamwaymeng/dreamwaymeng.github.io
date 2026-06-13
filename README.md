# Lu Meng's Academic Portfolio

Personal academic website for Lu Meng (孟璐), a hadron physics researcher at Southeast University. Built with Jekyll using the academicpages template.

**Live site**: [https://dreamwaymeng.github.io](https://dreamwaymeng.github.io)

## Features

- Bilingual support (English/Chinese)
- Dynamic citation statistics from INSPIRE-HEP API, with a citations-per-year histogram
- Content sections: About/Research, Group Members, Talks, Seminar Notices, Teaching, and Photos
- "Useful Links" quick links in the sidebar author profile (configured in `_config.yml`)
- Responsive, mobile-friendly design (e.g. the Group Members cards reflow on phones)

## Local Development

### Prerequisites

- Ruby 3.3.0 (use `rbenv` for version management)
- Bundler
- Node.js and npm

### Setup

```bash
bundle install
npm install
```

### Running the development server

```bash
bundle exec jekyll serve
```

Or with live reload and drafts:

```bash
bundle exec jekyll serve --livereload --drafts
```

The site will be available at `http://127.0.0.1:4000`

### Building JavaScript assets

```bash
npm run build:js
```

Watch for changes:

```bash
npm run watch:js
```

## Project Structure

Most content lives as Markdown pages under `_pages/` (this site does not use
separate `_talks/`, `_teaching/`, or `_publications/` collection folders).

```
├── _config.yml              # Jekyll config & author profile (incl. sidebar "Useful Links")
├── _data/
│   ├── authors.yml          # Author metadata
│   ├── navigation.yml       # Header menu structure
│   ├── ui-text.yml          # Multilingual UI strings
│   ├── citations_by_year.yml# Citation-per-year histogram data
│   └── cv.json              # Structured CV data
├── _includes/               # Reusable HTML components (author-profile, header, footer, …)
├── _layouts/                # Page templates
├── _pages/                  # Site pages (each a Markdown page)
│   ├── about.md / about_zh.md   # Homepage (EN) / Chinese homepage
│   ├── group_members.md         # Group members (responsive cards)
│   ├── mytalks.md               # Talks and presentations
│   ├── seminars.md              # Seminar Notices (invited seminars, by year)
│   ├── myteaching.md            # Teaching
│   └── photos.md                # Photos
├── _sass/                   # SCSS stylesheets
│   └── layout/              # incl. _group-members.scss, _citations.scss, _sidebar.scss
├── assets/                  # Static files (CSS, JS)
├── files/                   # Downloadable files (PDFs, slides), organized by year
└── images/                  # Image assets
    └── seminar/             # Seminar posters
```

## Deployment

The site is deployed via GitHub Pages. Push to the `master` branch triggers automatic deployment.

## License

Based on the [academicpages](https://github.com/academicpages/academicpages.github.io) template.
