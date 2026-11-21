# Léo Lacoste – personal profile site

A one-page site, plain HTML and CSS: no framework, no build step.

## Open it
Double-click `index.html`. It works offline in any browser.

## Edit it with Claude
1. Unzip this folder.
2. In Claude (Claude Code or the desktop app), open or attach the `leo-lacoste-site` folder.
3. Ask in plain words, for example:
   - "Change my email in the footer to …"
   - "Add these 3 results to the Jan Zandbergen role: …"
   - "Replace the portrait with this photo."

Everything is in `index.html`: styles at the top, content in the middle, a small script at the bottom.

## Still to fill in (marked with a dashed yellow "Needs from Léo" box)
- Email address in the footer (currently `name@email.com`)
- CV PDF: put it next to `index.html` as `cv-leo-lacoste.pdf`
- 2–3 results for the Jan Zandbergen Group role
- Optional: a sharper photo (shirt or jacket, plain background) for `img/leo-portrait.webp`

## Put it online (free)
Drag the folder onto https://app.netlify.com/drop, or push it to a GitHub repo and turn on GitHub Pages. A domain such as leolacoste.com costs about €10–15 a year.

## Design notes
- Colours: navy `#121A33` and champagne gold `#D6BC88`, on white and light grey.
- Fonts: Archivo (name, numbers, headings) and Inter (text).
- The `noindex` tag keeps it out of Google until he's ready. Remove it from `<head>` to make it public.
