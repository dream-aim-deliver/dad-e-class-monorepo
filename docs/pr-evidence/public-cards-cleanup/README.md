# Public cards cleanup — evidence

## Before (live prod `eclass.justdoad.ch`, logged out)

| File | What it shows |
|------|----------------|
| `before-de-offers.jpg` | `/de/offers` — sales, Erstellt von, von CHF, stars |
| `before-de-course.jpg` | Course page rating row |
| `before-de-coach-0-reviews.jpg` | Coach header `0 (0)` + cards with sales / Erstellt von / von |
| `before-de-coach-also-0-reviews-header.jpg` | Coach header `0 (0)`; course cards with 0 and ≥1 reviews |
| `before-de-coach-michelle-mixed-course-ratings.jpg` | Cards: `5 (1)` vs `0 (0)` |

Full-resolution PNGs also in Project store `media/public-cards-pr/`.

## After

Local platform stack could not be started on this Mac (no `node_modules` / GH Packages token).

- `after-fixture.html` / `after-fixture.png` — intended public UI after this PR
  - no CourseCreator row (label + avatar + name)
  - no sales; duration alone
  - stars only when reviews ≥ 1, drawn in platform button orange
  - `ab` price prefix; price 0 → only «Zum Angebot»
  - internal creator card still shows sales + creator
