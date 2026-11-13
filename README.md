# The Horror Movie Generator

Spin four reels (who it happens to, where, what is after them, and the mistake they
make), get a parody incident report, then file the claim to find out whether it has
already happened in a real horror film. An unofficial fan parody, written in the voice of
a made-up insurer's claims department.

- **Spin** builds an incident report: a title, a short plot and the projected losses.
- **File the claim** pauses, then stamps the finding: denied as a pre-existing condition
  (a real film matches all three of who, where and what), under review (two of three), or
  approved as original.
- About one spin in three is quietly steered onto a real film (`JACKPOT_RATE` in `app.js`).
- **Make a poster** turns a finding into an image. **Copy link** shares the claim.
- **Name That Movie** is a daily puzzle. **Would You Survive?** is a five-question risk
  assessment. **Real or Fake?** pits a real sequel title (or plot) against an invented one.
- **By the Numbers** and **the case archive** are computed from the same film list.

## Running it

Plain HTML/CSS/JS, no build step. Open `index.html`, or serve the folder:

    python3 -m http.server

To host it, turn on GitHub Pages for the repo (Settings → Pages → deploy from branch).

## The film data

- `data/films.json` is the source of truth: one entry per real film, filed from the
  opening of its Wikipedia article (who, where, the threat, the avoidable mistake,
  franchise, a one-line summary in our own words). Fields are `null` where the text did
  not say.
- `tools/build_movies.py` turns that file into `movies.js`. Run it after editing the data.
- `buckets.js` holds the reel options and all the parody copy.
