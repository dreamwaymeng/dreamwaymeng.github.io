#!/usr/bin/env zsh
set -e

JEKYLL_PORT="${JEKYLL_PORT:-4000}"
LIVERELOAD_PORT="${LIVERELOAD_PORT:-35729}"

bundle exec jekyll serve --livereload --drafts --port "$JEKYLL_PORT" --livereload-port "$LIVERELOAD_PORT"
