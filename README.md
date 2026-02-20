# bskinn.github.io

Personal site source for <https://bskinn.github.io>, migrated from Jekyll to Eleventy.

## Local Development

Requirements:

- Node.js 20+
- npm 10+

Commands:

```bash
npm install
npm run build
npm run dev
```

- `npm run build` writes output to `_site/`.
- `npm run dev` serves locally (default `http://localhost:8080`).

## Content Layout

- Posts: `_posts/`
- Layouts: `_layouts/`
- Includes/partials: `_includes/`
- Static assets: `images/`, `style.css`, `favicon.ico`, `CNAME`

## URL Behavior

- Post permalinks are preserved as `/:title/` (for example `/PyCon-2019-Recap/`).
- Tag index is at `/tags/`.
- Per-tag pages are available at:
  - `/tags/<tag>/` (current links)
  - `/tag/<tag>.html` (legacy parity)

## Deployment

GitHub Actions workflow: `.github/workflows/deploy.yml`

- Triggers on pushes to `main` and `master`
- Builds with Node + npm
- Publishes `_site/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`
- Disables Jekyll on publish (`.nojekyll`)

## Historical Notes

The previous repository README from the Jekyll-era setup is retained at `_old/README.md`.
