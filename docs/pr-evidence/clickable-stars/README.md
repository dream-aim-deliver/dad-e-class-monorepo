# Clickable stars (Prompt 2) — PR evidence

Stacked on `cursor/public-cards-cleanup-bc4f` (includes `d91dd393` CourseCreator public hide).

## Fixture

Local platform stack not runnable here (no node_modules / GH Packages token).
`after-fixture.html` / `.png` / `.jpg` illustrate intended UI states:

- Student in-progress: clickable stars + «Kurs bewerten» action
- Progress 0: hint «Starte den Kurs…»
- Min-reviews hidden: empty stars «Bewerten»
- Logged-in visitor not enrolled: not-enrolled hint
- Logged out: display only
- Already rated: opens ReviewDisplay
- Review modal course vs coach hints above textarea

Requires backend [cms#711](https://github.com/dream-aim-deliver/dad-e-class-cms-monorepo/pull/711) for progress &gt; 0 reviews (`COURSE_NOT_STARTED` otherwise).
