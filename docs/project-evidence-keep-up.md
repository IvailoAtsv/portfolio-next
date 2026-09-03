# Keep Up and HLP motion evidence

Added 2026-09-03. Project repositories were inspected read-only. No accounts,
production data, source applications, or deployments were changed.

## Keep Up

Live URL supplied by the user: https://sellphy.app. Its public landing page was
verified in the browser as Keep Up, with daily programming quiz positioning.

The case page is `/work/keep-up`. All three supplied recordings are included,
with the full frame and sequence preserved, encoded to H.264 at 900 × 1950,
60 fps, without audio, with fast-start MP4 metadata:

- `ScreenRecording_06-25-2026 14-24-18_1.MP4` → `quiz-feedback.mp4`, 9.98 seconds.
  Next.js multiple choice, checking, correct-answer explanation, next question.
- `ScreenRecording_06-25-2026 13-36-18_1.MP4` → `tap-code.mp4`, 11.3 seconds.
  TypeScript blocks assemble `let result: Array<string>`, explanation, next question.
- `ScreenRecording_06-25-2026 13-35-27_1.MP4` → `progress-reward.mp4`, 7.83 seconds.
  Web security answer, feedback, +1 moving into the daily counter, next question.

The actual four production sprite sheets were copied from `keep-up/public/mascot`.
Grid, dimensions, frame counts and 10 fps cadence come from
`keep-up/src/lib/mascot-sprites.ts`. The portfolio renders CSS background frames
with nearest-neighbor scaling, not an approximation or replacement animation.

Verified source details:

- `src/lib/mascot.ts` and `src/components/mascot/QuizMascotDock.tsx`: quiz context
  controls mascot feedback state.
- `src/components/quiz/TapCodeArea.tsx` and `src/lib/quiz-motion.ts`: tap-code flight,
  separate panel resize and question slide transitions, reduced-motion handling.
- `src/lib/quiz-local.ts`: due reviews precede unseen questions, filtered to
  selected technologies and difficulty; selection runs against local records.
- `src/lib/srs.ts`: again/good/easy grades; a wrong answer returns in one day,
  first-try correct answers receive longer initial intervals.
- `src/lib/db/index.ts` and `src/lib/db/schema.ts`: IndexedDB and queued sync work.
- `src/app/api/sync/push/route.ts`: server synchronization with idempotency keys.

The case does not claim measured learning gains, retention, active users, or a
production offline test. Recordings are historical product evidence.

## HLP Labs

User-supplied `589df67ac0364c429468611c06431fec.MOV` is a 288 × 636, 6.59-second,
silent checkout demo. It was remuxed without video re-encoding into
`checkout-motion.mp4`. `checkout-detail.mp4` is a crop of the bottom action
(x42 y576, 244 × 60), encoded as H.264. It is explicitly labeled an enlarged crop.

`m-ecom/components/shop/checkout/ConfirmOrderButton.tsx` and its CSS module
verify the parcel, doors, truck and road sequence; repeat-tap guard; timer cleanup;
and simpler reduced-motion branch. The case describes the animation, not actual
shipping progress, checkout transaction correctness, or a live purchase.

## Portfolio playback

Native video controls remain available. Videos use local posters and preload none,
play muted when visible, pause out of view, respect an explicit user pause, and
avoid automatic playback under reduced motion. The sprite player has four state
buttons, a pause/play control, and suspends its frame loop offscreen.

## Integration checks

- Astro check: zero errors, warnings, or hints; all five portfolio routes build.
- Browser at 1440 × 1000 and 390 × 844: no horizontal document overflow on
  Keep Up, HLP, Sellphy, or Finance Me.
- All three Keep Up videos and both HLP video views reached readyState 4 and
  played in view. Keep Up clips paused when scrolled out of view.
- All four sprite states and pause/play controls were exercised; Finance Me
  examples returned Coffee for Starbucks and Other expenses for an unknown shop.
- Homepage links reach all four case studies, with no cutting-room placeholders.
- Build output check resolved all 130 internal page and asset references.
- Reduced-motion handling was reviewed in source; no OS preference was changed.
- Browser screenshots are in `.impeccable/review/cases/`.

No commit, push, or deployment is included in this task.
