# Léo Lacoste – profile site

A small multi-page site, plain HTML, CSS and JavaScript: no framework, no build step.

| Page | File |
|---|---|
| Home | `index.html` |
| Career | `career.html` |
| My next step | `my-next-step.html` |
| FAQ | `faq.html` |

Shared styles are in `assets/style.css` (colours and fonts are tokens at the top) and shared behaviour in `assets/site.js`.

## Open it
Double-click `index.html`. Everything works offline except the display font (Newsreader, from Google Fonts), which falls back to Georgia.

## Still to fill in (marked with a dashed yellow "Needs from Léo" tag)
- **Main photo**: `img/leo-meeting.webp` is the first hero photo; the portrait is second.
- More hero photos: add another `<img src="img/…" alt="…" data-cap="Caption">` inside `.photo` in `index.html`. Missing files are skipped.
- Email address in the contact block (currently `name@email.com`)
- CV PDF: put it next to `index.html` as `cv-leo-lacoste.pdf`
- Two or three results for the Jan Zandbergen Group role (`career.html`)
- Confirm the "My next step" page: it is written from his CV, as a draft of the role he is after.

## Design notes
- Inspired by the structure and voice of a reference portfolio: tabs, a short version in four lines, one interactive signature (a map of the European markets Léo has sold into), results-first copy in the first person.
- Colours: ink `#14161B` on warm white, navy accent `#1D3A7A`, tinted sand, blue and sage panels.
- Fonts: Newsreader (headings) and Inter (text).
- The `noindex` tag keeps it out of Google until he's ready. Remove it from each page's `<head>` to make it public.
