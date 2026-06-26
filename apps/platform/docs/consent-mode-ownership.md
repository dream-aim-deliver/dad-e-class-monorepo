# Google Consent Mode — ownership model

> Compliance-critical reference. Read before changing analytics, GTM, or
> Usercentrics wiring. Introduced in `feature/fix-consent-premature-grant`
> after premature `gcs=G101` hits on eclass.justdoad.ch.

## Problem this documents

Before the fix, the Next.js app maintained a **duplicate consent bridge**:
`ConsentProvider` → `usercentrics-adapter` → `updateConsent()` →
`gtag('consent', 'update', …)` in `AnalyticsProvider`, **in addition to**
the Usercentrics GTM Tag Template. That bridge reacted to `UC_UI_INITIALIZED`
and implicit `onInitialPageLoad` events and granted tracking signals before
the user clicked the banner — visible as `gcs=G101` on `consent_state` /
`user_engagement` after the first `page_view` (`gcs=G100`).

## Who owns what (after the fix)

| Concern | Owner | Where configured |
| --- | --- | --- |
| `gtag('consent', 'default', all-denied)` | **Usercentrics GTM Tag Template** | GTM → Consent Initialization trigger |
| `gtag('consent', 'update', …)` | **Usercentrics GTM Tag Template** | GTM → UC_UI listeners in template |
| `window.dataLayer` + `window.gtag` shim | **App** (`GtagBootstrapScript`) | `layout.tsx` `<head>`, no consent commands |
| GTM container load | **App** (`AnalyticsProvider`) | Runtime `NEXT_PUBLIC_GTM_ID` |
| Usercentrics CMP scripts | **App** (`UsercentricsAutoblocker`, `UsercentricsCMPLoader`) | `layout.tsx` `<head>` |
| In-app feature gating (OTel, `track.*`) | **App** (`ConsentProvider` + `usercentrics-adapter`) | Reads UC_UI; **does not call gtag** |

**Rule:** The React app must never push `gtag('consent', …)` — neither default
nor update. One owner per command type. Violating this recreates the race that
produced premature `G101`.

### Why the app bridge was removed (not just hardened)

GTM already owns consent updates via the Usercentrics template. The app bridge
was redundant and fired on lifecycle events (`UC_UI_INITIALIZED`, implicit
`onInitialPageLoad`) that are not user decisions. Wix (justdoad.ai) never had
this bridge — which is why behaviour diverged despite the same Usercentrics
account.

The adapter remains for **first-party gating only**, with explicit-consent
filtering (`consent.type === 'EXPLICIT'`) and CMP event filtering
(`ACCEPT_ALL` / `DENY_ALL` / `SAVE_CC`).

## Manual verification checklist

Run on **eclass.justdoad.ch** (or staging with the same GTM + Usercentrics IDs).
Use a fresh session (incognito / cleared site data) unless testing returning
visitors.

### Before deploy (broken baseline — for comparison)

1. Open DevTools → Network, filter `google-analytics.com` or `/g/collect`.
2. Load any page **without** clicking the consent banner.
3. **Expect (bug):** first hit `gcs=G100`, then `consent_state` /
   `user_engagement` with `gcs=G101` (analytics granted before click).

### After deploy (fixed)

#### A — First visit, no banner interaction

1. Fresh session, load `/en` (or any route).
2. Do **not** click Accept / Deny.
3. **Expect:** all GA4 collect hits show `gcs=G100` only.
4. **Expect:** no `consent_state` event with analytics granted.
5. Console spot-check (optional):
   ```js
   google_tag_data?.ics?.entries?.analytics_storage
   // update should be false or absent; not granted before click
   ```

#### B — After explicit accept

1. Click **Accept all** (or equivalent) on the Usercentrics banner.
2. **Expect:** subsequent GA4 hits show `gcs=G111` (or tenant-equivalent
   full-grant code for your signal mix).
3. **Expect:** `consent_state` fires once, after the click.

#### C — Returning visitor (regression)

1. Accept on first visit, close tab.
2. Reopen same site in the same browser profile (cookie stored).
3. **Expect:** no banner (or minimal UI); GA4 hits may show granted consent
   from first load — that is correct stored consent, not premature grant.

#### D — In-app gating (OTel)

1. Fresh session, before accept: OTel browser traces should **not** export.
2. After accept: OTel may export if analytics category is consented in
   Usercentrics dashboard.

### GTM Preview (optional)

1. GTM Preview mode → load site.
2. Consent tab: all denied before banner interaction.
3. Accept → Consent tab shows granted; Usercentrics template tag fires.

## If Usercentrics or GTM is removed from a tenant

Re-implement **both** default and update in one place (code **or** GTM, never
both). See comments in `consent-mode.ts` and `gtag-bootstrap-script.tsx`.

## Related dashboard review (non-blocking for merge)

Luis to verify in Usercentrics Admin (same account as justdoad.ai):

- Google Analytics category assignment (`statistics` vs `marketing`).
- Why services report `consent.status: true` with `type: IMPLICIT` on
  `onInitialPageLoad` before user interaction.

These are configuration hygiene items; the code fix removes the duplicate
bridge regardless.
