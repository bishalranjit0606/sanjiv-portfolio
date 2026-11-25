# Sanjiv Portfolio — Project Context

This file is the source of truth for Sanjiv Portfolio. Read it before architectural decisions or large feature changes.

Labels used below:

- **Existing:** present in this repository today.
- **Planned:** agreed direction, not built yet.
- **Unconfirmed:** not decided. Do not invent a value.

Last reviewed against the codebase: 2026-11-21.

## 1. Project identity and purpose

**Existing name:** Sanjiv Portfolio.

**Repository:** [bishalranjit0606/sanjiv-portfolio](https://github.com/bishalranjit0606/sanjiv-portfolio).

**Purpose:** A personal portfolio website whose main job is publishing and managing blog articles. It should also present the owner's identity, background, skills, and experience.

This is a personal site. It is not a commercial product, a SaaS platform, or an enterprise app.

The site should stay fast, clear, easy to maintain, and free to host.

**Existing starting point:** The repo began as the AstroPaper theme, version 4.2.0 (`package.json` name is still `astro-paper`). It is connected to Pages CMS. The public site is a simple blog titled Sanjiv. A fuller biography and design are still waiting on details from the owner.

Do not invent the owner's name, biography, job history, skills, or social accounts. Those details will be provided later.

## 2. Intended users and primary use cases

**Primary user:** the portfolio owner.

**Primary use case:** publish a blog without opening Cursor, writing code, or deploying by hand.

1. Log in to Pages CMS.
2. Create, edit, or delete an article.
3. Pages CMS saves Markdown to this GitHub repository.
4. GitHub Actions builds the static site.
5. GitHub Pages publishes it.

**Other visitors:** people reading the portfolio and the blog.

**Planned visitor tasks:**

- Read the introduction and featured posts on the homepage.
- Browse articles, dates, descriptions, tags, and optional images.
- Read a single article with good typography, SEO metadata, and share previews.
- Read an About page.
- Reach the owner by email or social links, with no form backend.

## 3. Confirmed technology stack

Versions below are the ones installed in `package-lock.json` on 2026-11-21.

| Piece | Status | What is installed or intended |
| --- | --- | --- |
| Frontend | Existing | Astro 4.2.1, static output. No adapter. |
| Language | Existing | TypeScript 5.3.3. `tsconfig.json` extends `astro/tsconfigs/strict`. |
| Interactive UI | Existing | React 18.2.0 and `@astrojs/react` 3.0.9. Used for search, post cards, and dates. Keep this. Do not expand it without a reason. |
| Styling | Existing | Tailwind CSS 3.4.1, `@astrojs/tailwind` 5.1.0, `@tailwindcss/typography` 0.5.10. Config: `tailwind.config.cjs`. Base styles: `src/styles/base.css`. |
| Content | Existing | Markdown in `src/content/blog`. No MDX files and no `@astrojs/mdx`. |
| CMS | Existing | Pages CMS, configured in `.pages.yml`. |
| Content storage | Existing | Markdown files in this Git repository. |
| Search | Existing | Fuse.js 7.0.0, client-side, on `/search/`. |
| SEO extras | Existing | `@astrojs/sitemap` 3.0.5, `@astrojs/rss` 4.0.2, generated Open Graph images (`satori`, `@resvg/resvg-js`). |
| Markdown extras | Existing | `remark-toc`, `remark-collapse`. Code highlighting uses Shiki theme `one-dark-pro`. |
| Build post-step | Existing | `npm run build` runs `astro build && jampack ./dist` (`@divriots/jampack`). |
| Tooling | Existing | ESLint, Prettier, Husky, lint-staged, Commitizen. |
| Version control | Existing | Git and GitHub. |
| Hosting | Planned | GitHub Pages. |
| Deployment | Planned | GitHub Actions for this repository. |
| Database | Not used | None. Do not add one. |
| Backend server | Not used | None. Do not add one. |

Node used by the leftover Studio workflow is 20. `docker-compose.yml` uses the `node:18` image. Astro 4 expects Node `>=18.14.1`. There is no `.nvmrc`.

**Out of scope unless the owner explicitly approves it:** Next.js, Express, PostgreSQL, MongoDB, Firebase, Supabase, and any other backend or paid platform.

## 4. Existing repository architecture

AstroPaper layout, still in the theme's original shape.

```text
/
├── .github/workflows/deploy.yml    # GitHub Pages deploy
├── .github/workflows/_studio.yml   # leftover Astro Studio workflow
├── .pages.yml                      # Pages CMS config
├── astro.config.ts
├── package.json                    # name: astro-paper, version 4.2.0
├── public/                         # favicon, logo, theme toggle, illustration
├── src/
│   ├── assets/socialIcons.ts
│   ├── components/                 # Astro components; a few React islands
│   ├── config.ts                   # site title, URL, social links
│   ├── content/
│   │   ├── blog/                   # Markdown posts
│   │   └── config.ts               # blog collection schema
│   ├── layouts/
│   ├── pages/
│   ├── styles/base.css
│   └── utils/
└── docs/PROJECT_CONTEXT.md
```

**Existing routes:**

| Route | Role |
| --- | --- |
| `/` | Homepage: intro, social links, featured posts, recent posts |
| `/posts/` | First page of the blog list |
| `/posts/[slug]/` | Article page |
| `/about/` | About page from `src/pages/about.md` |
| `/tags/`, `/tags/[tag]/`, `/tags/[tag]/[page]/` | Tag index and tag archives |
| `/search/` | Client-side search |
| `/rss.xml` | RSS feed |
| `/404` | Not found |
| sitemap | Generated by `@astrojs/sitemap` |
| `robots.txt` | Generated by `src/pages/robots.txt.ts` |

There is no dedicated Contact route. Email is a social entry in `src/config.ts` and is currently inactive (`active: false`, placeholder `mailto:yourmail@gmail.com`).

**Existing blog behavior:**

- Posts live in the `blog` collection (`src/content/config.ts`).
- Required frontmatter includes `pubDatetime`, `title`, and `description`.
- `draft: true` hides a post. `src/utils/postFilter.ts` also hides posts whose publish time has not arrived, except during `astro dev`.
- `scheduledPostMargin` is 15 minutes.
- Featured posts (`featured: true`) render in a separate homepage block.
- Tags, pagination helpers, RSS, sitemap, share links, and per-post Open Graph images already exist.
- `src/config.ts` sets `postPerPage` to 3.
- Numbered post list pages (`/posts/2/` and later) are generated by `src/pages/posts/[slug]/index.astro` when the slug is a page number.

**Existing content:** `src/content/blog` is empty. The AstroPaper sample posts were removed after the live site was checked. New posts are added in Pages CMS.

**Site identity** in `src/config.ts`:

- `website`: `https://bishalranjitkar.com.np/sanjiv-portfolio/`
- `author`: `Sanjiv`
- `title`: `Sanjiv`
- `ogImage`: `astropaper-og.jpg` (referenced; that file is not in `public/` in this checkout)

`PUBLIC_WEBSITE` in `src/config.ts` is the only URL to change. `DEPLOY.site` and `DEPLOY.base` are derived from it and passed to Astro. In-site links use `withBase()` so they follow `base`. See section 6.

## 5. Content management workflow

**Existing:** `.pages.yml` is the Pages CMS config. Preserve it unless a change is required for Astro and Pages CMS to agree.

Current collections:

- `posts`: collection at `src/content/blog`. Fields include author, `pubDatetime`, `modDatetime`, title, `ogImage`, slug, featured, draft, tags, description, and rich-text body.
- `about`: single file at `src/pages/about.md`.

Media input is `public`, output `/`.

**Known schema gaps to respect, not silently "fix":**

- The posts list view asks for a field named `date`. Post frontmatter uses `pubDatetime`.
- The `ogImage` field label in `.pages.yml` says "Title".
- Astro's schema includes optional `canonicalURL`. `.pages.yml` does not.
- `.pages.yml` includes `slug`. Astro content collections also derive the slug from the file.

Any future schema change must work in both Astro's content schema and `.pages.yml`.

**Publishing path:**

1. Owner logs in to Pages CMS.
2. Owner creates, edits, or deletes an article.
3. Pages CMS commits the Markdown (and any media) to this repository, on `main`.
4. `.github/workflows/deploy.yml` runs on that push.
5. GitHub Pages serves the new static files.

The workflow file is in the repo. It publishes only after these changes are pushed and the repository Pages source is set to GitHub Actions. See section 6.

Drafts must not appear on the public site. The current `draft` flag and `postFilter` are the mechanism. Keep that behavior.

The owner should not need Cursor or a manual deploy for a normal article.

## 6. Hosting and deployment strategy

**Host:** GitHub Pages, free. Configured in this repo. It goes live after the workflow is pushed and GitHub Pages is set to deploy from GitHub Actions.

**This repository only:** `bishalranjit0606/sanjiv-portfolio`.

**Public URL:** `https://bishalranjitkar.com.np/sanjiv-portfolio/`. The GitHub Pages project path is still part of this address.

**Unconfirmed:** the custom domain. It has not been chosen. Do not assume one exists. Do not add a `CNAME` until the owner provides the domain.

**Hard boundary:** `bishalranjit0606.github.io` is a different website. Never modify, delete, redeploy, overwrite, or reconfigure that repository. All work stays in `sanjiv-portfolio`.

**How the URL is configured:**

- `PUBLIC_WEBSITE` in `src/config.ts` is the visitor URL, including the repository path.
- Astro `site` is the origin only: `https://bishalranjit0606.github.io`.
- Astro `base` is `/sanjiv-portfolio`.
- Both are derived in `DEPLOY`. Do not set `site` or `base` by hand in `astro.config.ts`.
- Component links use `src/utils/withBase.ts`. Markdown root paths are prefixed in `src/utils/rehypePrefixBase.ts`.
- Sitemap and RSS use the full public URL. A local production check showed page, post, tag, CSS, JS, favicon, and About image URLs under `/sanjiv-portfolio/`.

**Custom domain later:**

1. Connect the domain to this repository's GitHub Pages site.
2. Add `public/CNAME` with the domain name.
3. Change `PUBLIC_WEBSITE` to that origin, with a trailing slash and no repository path.
4. Leave the `withBase()` calls in place. `base` becomes `/` from the new URL.

**Deploy workflow:** `.github/workflows/deploy.yml`.

- Triggers on every push to `main`, and when someone runs it by hand.
- Uses the official Astro action `withastro/action@v6`.
- Node is pinned to 20 because this project is Astro 4.2.
- The build job runs `npm run build`. The deploy job publishes `dist` with `actions/deploy-pages`.
- It does not touch any other repository.

**Manual GitHub settings, required once:**

1. Open `bishalranjit0606/sanjiv-portfolio` on GitHub.
2. Settings, then Pages.
3. Set Source to GitHub Actions.
4. Push this workflow to `main`. The first successful run publishes the site.
5. Leave the separate `bishalranjit0606.github.io` repository alone.

**Leftover workflow:** `.github/workflows/_studio.yml` is the theme's Astro Studio workflow. It is not the publishing pipeline and this repo has no database. The README still mentions Cloudflare Pages. That is old theme documentation.

## 7. Website page requirements

Design, branding, and personal facts are **unconfirmed**. Build them only from details the owner supplies.

| Page | Status | Requirement |
| --- | --- | --- |
| Homepage | Existing theme page. Planned content change. | Professional introduction, branding, featured posts, short biography, social links. |
| Blog list | Existing at `/posts/`. | Published articles, dates, descriptions, tags, optional images. |
| Article | Existing at `/posts/[slug]/`. | Long-form type, SEO metadata, share previews, responsive layout. |
| About | Existing at `/about/`, still theme copy. | Owner background, experience, skills, and interests, once provided. |
| Contact | Planned. No backend form. | Email and social links are enough. A dedicated page is optional. |
| Tags and search | Existing theme features. | Keep unless a later decision says to remove them. |

## 8. Design principles

1. Simple, reliable, fast, accessible, and easy to maintain.
2. Reuse AstroPaper where it already fits.
3. Add a dependency only when the current stack cannot do the job.
4. Prefer static generation.
5. Stay compatible with GitHub Pages.
6. Keep Pages CMS working.
7. Stay responsive.
8. Use semantic HTML and solid SEO.
9. Keep the code modular and readable.
10. Stay on free hosting. No usage-based infrastructure.
11. Never commit credentials or secrets.
12. Do not commit or push unless the owner asks.
13. After implementation changes, test the affected behavior and run the production build.
14. Keep sample posts until the blog path is verified.
15. Do not add features that need a server running all the time.

## 9. Technical constraints

- Static Astro site only. No server rendering, no adapter, no database, no backend.
- Pages CMS remains the publishing UI. Preserve `.pages.yml` and `src/content/blog` unless a change is necessary and still valid for both tools.
- Draft and future-dated posts stay off the public site.
- The public URL lives in `PUBLIC_WEBSITE`. Astro `site` and `base` are derived from it. In-site links must use `withBase()`, not a hardcoded `/`.
- Custom domain is unconfirmed.
- Never touch `bishalranjit0606.github.io`.
- React stays limited to the islands that already need it.
- Markdown stays the content format unless MDX is explicitly approved. Adding MDX would also require a Pages CMS and Astro schema change.
- The Astro Studio workflow is leftover theme machinery. It is not a reason to add Astro DB.
- Sample posts stay until publishing has been verified on the real site.
- Personal content is supplied by the owner. Do not fabricate it.

## 10. Development conventions

- Consult this file before architectural decisions or substantial features.
- When an important architecture decision, major feature, stack change, or publishing change lands, update this file in the same work. Do not rewrite unrelated sections.
- Describe features as existing only when the code does that thing.
- Match current Astro, Tailwind, and TypeScript style. Path aliases live in `tsconfig.json` (`@components`, `@layouts`, `@config`, and the others).
- Site-wide settings belong in `src/config.ts`.
- Do not commit or push without an explicit request.
- Do not put secrets in the repo. `.env` is gitignored.
- Useful commands, from the repo root:
  - `npm run dev` — local site at `localhost:4321`
  - `npm run build` — production build to `./dist/`
  - `npm run preview` — serve the production build
  - `npm run lint` — ESLint
  - `npm run format:check` — Prettier check

## 11. Future enhancement ideas

These are ideas only. None of them are approved work.

- Replace theme branding with the owner's name, copy, colors, and social links.
- Decide what to do with `_studio.yml`. It is not part of publishing.
- Align `.pages.yml` field names with the Astro frontmatter (`pubDatetime`, `ogImage` label, optional `canonicalURL`).
- Optional contact page that only lists email and social links.
- Add a real biography, photo, and social links when the owner provides them.
- Choose the final custom domain and connect it to this repository's GitHub Pages site.

## 12. Current implementation status

**In place:**

- AstroPaper 4.2.0 static blog: home, posts, articles, about, tags, search, RSS, sitemap, draft filter, light and dark mode.
- Tailwind styling and a small set of React islands.
- Pages CMS config for posts and the About page.
- An empty blog folder, ready for posts from Pages CMS.
- Local scripts for dev, build, lint, and format.
- GitHub Pages URL, `base` path, and `.github/workflows/deploy.yml`. A local production build succeeds. The live site appears after this is pushed and Pages is set to GitHub Actions.

**Not in place:**

- Owner branding and real biography.
- A pushed deploy and the one-time GitHub Pages source setting.
- Custom domain.
- Dedicated contact page.
- Confirmation on GitHub that a Pages CMS commit has published a new article.

**Still template leftovers:**

- `package.json` name `astro-paper`.
- README deployment notes for Cloudflare Pages.
- `.github/workflows/_studio.yml`.
- Theme layout, search, tags, and RSS from AstroPaper.
- MIT license copyright (c) 2023 Sat Naing.

## 13. Important architectural decisions

1. **Static Astro site.** Pages are generated at build time. No server and no database. Decided.
2. **Pages CMS writes to Git.** Articles are Markdown files in `src/content/blog`. Decided. The CMS config already exists.
3. **Free hosting on GitHub Pages for this repo only.** Decided. `deploy.yml` builds this repo and publishes it. The live site still needs a push and the Pages source set to GitHub Actions.
4. **`bishalranjit0606.github.io` is off limits.** Decided.
5. **Drafts are unpublished.** Decided. Implemented by the `draft` frontmatter flag and `postFilter`.
6. **Keep AstroPaper behavior that already fits** (tags, search, RSS, sitemap, OG images, theme toggle) until a specific change is requested. Decided as a default.
7. **React stays where it already is.** Decided as a constraint. New UI should prefer Astro.
8. **Custom domain later, through `PUBLIC_WEBSITE`.** Direction decided. The domain name is unconfirmed. Do not hardcode `/sanjiv-portfolio` in links.
9. **Sample posts stay for now.** Decided until the blog publish path is verified.
10. **No new backend services.** Decided unless the owner explicitly approves one.
