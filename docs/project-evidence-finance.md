# Finance Me case-study evidence

Source inspected read-only on 2026-09-03: `/Users/Ivajlo/Documents/GitHub/finance-me`, local commit `32df4aa` (`fix tags`). This checkout was behind origin/main by two commits and already had a deleted Shortcut file. No source-repository files, database records, deployment settings or production data were changed.

The portfolio page is `/work/finance-me`. No Finance Me screenshots or recordings were supplied or discovered in this repository. The case therefore uses labeled source-derived workflow diagrams, a small merchant/category explanation, and the existing generated savings illustration. It makes no production verification or commercial impact claim.

## Claim map

- **Wallet to Shortcuts to import:** `docs/ios-wallet-shortcuts.md`, `app/api/import/apple-wallet/route.ts`, and `app/dashboard/profile/page.tsx`. The documentation describes the user-configured Wallet personal automation. The API parses its payload, authorizes an import token, categorizes the transaction, derives tags, and assigns the current family if present. The case does not claim direct bank synchronization or that an automation is already configured for every user.
- **Category and merchant detail:** `src/lib/apple-wallet-import-logic.ts`, specifically `normalizeMerchant`, `detectCategoryId`, and `deriveAppleWalletTags`. Merchant rules map Lidl to groceries and Starbucks to coffee. Unknown merchants return `other_expense`. Merchant names and `apple-pay` remain tags. The interactive case example uses these actual rules with illustrative merchant data, not production financial records.
- **Amount parsing:** `src/lib/validation/apple-wallet-amount.ts` accepts comma and dot decimal formats and strips currency labels. This is parsing, not foreign exchange conversion; the case does not claim multi-currency accounting.
- **Duplicate import safeguard:** `app/api/import/apple-wallet/route.ts` fingerprints user ID, source, amount in cents, normalized merchant and date rounded to the minute. `src/lib/models/Transaction.ts` declares the unique sparse compound index on creator/source/fingerprint. MongoDB error 11000 returns a successful deduped response. The page explicitly describes minute-level matching as a retry safeguard, not a bank transaction ID.
- **Shared scope:** `src/lib/server/transaction-scope.ts`, `app/api/transactions/route.ts`, and `app/api/import/apple-wallet/route.ts` implement the shared family transaction pool and solo creator scope. The case intentionally avoids README's outdated personal-versus-shared toggle claim.
- **Creator identity:** `src/components/dashboard/transaction-list-item.tsx` renders `TransactionCreatorAvatar`; records retain `createdBy` in `src/lib/models/Transaction.ts`.
- **Invitation checks:** `app/api/family/join/route.ts` validates invitation expiry and matching account email before adding the user to a family.
- **Return-to-app refresh:** `src/hooks/use-refresh-on-focus.ts` refreshes on focus/visibility, throttled to a minute and skipped soon after a mutation. The copy describes refresh on returning to the app, not continuously live synchronization.
- **Analytics and export:** `src/lib/data/analytics.ts` uses the shared transaction scope; `src/components/dashboard/transactions-page-client.tsx` contains `exportToCSV`. Export is a user-invoked transaction export, not a claim about a full-account backup.
- **Goal time horizons and contributions:** `src/lib/goals.ts`, `app/dashboard/goals/page.tsx`, `src/lib/models/Goal.ts`, `src/lib/models/GoalContribution.ts`, and `app/api/goals/[id]/contributions/route.ts`. The real buckets are 0–3 years, 3–10 years and 10+ years. Goals track balance, optional target and contributions; contributions carry contributor identity, amount and optional note.
- **Goal prerequisite/empty state:** `app/dashboard/goals/page.tsx` explicitly explains that goals require a family and links to `/dashboard/family`. The separate no-goals state offers goal creation.

## Deliberate exclusions

No invented users, revenue, retention, testimonial, performance percentage, or outcome metric. No claims of AI financial advice, bank integration, offline operation, live WebSocket updates, deployed Shortcut availability, end-to-end security assurance, or live production QA. The README was treated as a navigation aid, with claims checked against implementation.

## Verification boundary

The case explains inspected source behavior. It is not a security audit or confirmation that every branch of the original application is production-ready. Portfolio route compilation and visual checks are handled in the parent task's integration pass.
