# Article content source

This directory is reserved for structured editorial source files as article pages are migrated in phases. Existing public pages under `blog/<slug>/index.html` and `journal/<slug>/index.html` remain live and must not be deleted or moved during this setup.

## Required fields for a future article record
- `slug` and public URL
- `title`, `description`, `language`, `category`, `publishedAt`, `updatedAt`
- `coverImage` and meaningful alt text (when applicable)
- `body` (original article copy)
- `canonical`, `hreflang`, `relatedArticles`
- structured-data requirements and verified sources where claims require them

Do not duplicate article text in both a source record and page renderer indefinitely. Each migrated article family must have one declared source of truth and a tested generation/rendering path.
