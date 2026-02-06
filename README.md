# Lu Meng's Academic Portfolio

Personal academic website for Lu Meng (孟璐), a hadron physics researcher at Southeast University. Built with Jekyll using the academicpages template.

**Live site**: [https://dreamwaymeng.github.io](https://dreamwaymeng.github.io)

## Features

- Bilingual support (English/Chinese)
- Dynamic citation statistics from INSPIRE-HEP API
- Sections for research, group members, talks, teaching, and photos
- Responsive design

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

```
├── _config.yml          # Jekyll configuration
├── _data/               # YAML/JSON data files
│   ├── navigation.yml   # Header menu structure
│   ├── ui-text.yml      # Multilingual UI strings
│   └── cv.json          # Structured CV data
├── _includes/           # Reusable HTML components
├── _layouts/            # Page templates
├── _pages/              # Main site pages
├── _sass/               # SCSS stylesheets
├── _talks/              # Conference presentations
├── _teaching/           # Teaching materials
├── _publications/       # Academic papers
├── assets/              # Static files (CSS, JS, images)
├── files/               # Downloadable files (PDFs)
└── images/              # Image assets
```

## Deployment

The site is deployed via GitHub Pages. Push to the `master` branch triggers automatic deployment.

## License

Based on the [academicpages](https://github.com/academicpages/academicpages.github.io) template.
