# Charis Music Online Note Tool

A static GitHub Pages project for embedding in the Charis Music Wix website.

## Options

1. Pitch
2. Clef
3. Quarter / eighth note
4. Spacing: near clef, key signature space, or key + time signature space

The SVG is generated entirely in the browser. No server, database or manifest file is required.

## Publish on GitHub Pages

1. Create a new public GitHub repository.
2. Upload all files from this folder to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. GitHub will provide a Pages URL such as:
   `https://USERNAME.github.io/REPOSITORY/`

## Embed in Wix

In Wix, add **Embed Code → Embed a Site**, then paste the GitHub Pages URL.
Recommended iframe width: 100%.
Recommended iframe height: about 880 px on mobile and 760 px on desktop; adjust after testing.

## Before publishing

The canonical link in `index.html` currently points to the Charis Music homepage. After the final Wix tool page exists, replace it with the exact Wix page URL, for example:

`https://www.charismusic.co.uk/note-generator`

## Files

- `index.html` — page structure and SEO metadata
- `style.css` — responsive 360 px mobile-first layout
- `app.js` — notation engine, preview and SVG/PNG downloads
