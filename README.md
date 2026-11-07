# Doll of Sorrows

A vintage tattoo artist website with roses, lace, a pixel fashion doll, and a nostalgic personal-web layout.

The website lives in `docs/`. It uses plain HTML, CSS, and JavaScript, with no build step or external runtime dependencies.

## Preview locally

With Node.js installed, run `npm run dev` and open `http://127.0.0.1:4173`.

Run `npm run check` to check JavaScript syntax.

## Publish with GitHub Pages

In the repository's **Settings → Pages**, choose **Deploy from a branch**, select **main**, choose **/docs**, and save. All website asset paths are relative, so the site works under the repository's project URL or a custom domain.

## Update the website

- Edit page text and links in `docs/index.html`.
- Edit the palette, lace, wallpaper, and responsive layout in `docs/style.css`.
- Edit the inquiry helper, love-letter composer, and optional music box in `docs/app.js`.
- Keep website images and ornaments in `docs/assets/`.

The tattoo gallery currently directs visitors to the artist's Instagram until real portfolio photos are supplied. The inquiry helper prepares a message for visitors to copy into Instagram; it does not submit bookings or store personal details. Love letters also stay on the current page until the visitor copies and sends them.

The code license is in `LICENSE`. The bundled typeface has its own license in `docs/assets/FONT-LICENSE.txt`.
