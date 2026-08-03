# Consent Mode audit results

Saved output from `../src/consent-audit.spec.ts` — evidence that tracking
consent is (or is no longer) granted before a visitor touches the cookie
banner, on both production sites.

## Running

```bash
AUDIT_LABEL=before-fix pnpm exec playwright test -c apps/platform-e2e/consent-audit.config.ts
```

Each run writes two files per label:

- `consent-audit-<label>.json` — full machine-readable observation
- `consent-audit-<label>.md` — human-readable report to share

`AUDIT_LABEL` names the run. Use `before-fix` / `after-fix` so the two are
directly diffable:

```bash
diff consent-audit-before-fix.md consent-audit-after-fix.md
```

## What "fixed" looks like

The suite fails today. After the Usercentrics change, all three assertions
should pass on both sites:

| Check | Broken (now) | Fixed |
| --- | --- | --- |
| Non-essential services granted pre-click | 7 | 0 |
| Granted `gtag` consent updates pre-click | 2–3 | 0 |
| GA4 hits above `gcs=G100` pre-click | 1–2 | 0 |
| Verdict | FAIL ❌ | PASS ✅ |

## Baseline: `before-fix` (2026-08-03)

Both sites load the **same** Usercentrics configuration `jnaPMX-WDaJ4Ig`, so one
dashboard change affects both.

| Site | Pre-click result |
| --- | --- |
| justdoad.ai (Wix) | `G100` → **`G101`** — analytics granted, no click |
| eclass.justdoad.ch (Next.js) | `G100` → **`G101`** → **`G111`** — analytics + ads granted, no click |

The same 7 non-essential services are pre-granted (`type: IMPLICIT`) on both:
Google Analytics, Google Ads, Google Tag Manager, DoubleClick Ad, LinkedIn
Insight Tag, LinkedIn Plugin, YouTube Video.

The shared `G101` comes from the Usercentrics GTM template acting on implicit
consent; the additional `G111` on eclass is the app's own consent bridge
escalating it to ad consent. **Both sites are affected** — the Wix site is not
clean, so the defect is not specific to the Next.js integration.

## Granular consent (2026-08-03) — two app-side bugs, fix not yet deployed

The granular test drives the CMP's second layer, accepts **only Google
Analytics**, and saves. Measured on eclass.justdoad.ch:

| Source | Consent update pushed |
| --- | --- |
| Usercentrics GTM template | `analytics_storage: granted`, all ad signals **denied** ✅ |
| **our app** | `ad_storage`, `ad_user_data`, `ad_personalization` **granted** ❌ |

Plus **13 OpenTelemetry collector posts** after saving, for a service the user
had explicitly refused.

Two distinct defects, both app-side, both invisible to Accept-All / Deny-All:

1. **Advertising consent from an analytics-only choice.** Google Analytics is
   filed under `marketing` in this tenant's dashboard, so accepting it alone
   flipped the whole marketing category and every ad signal with it. The
   Usercentrics template handled the same case correctly, which is what
   identified the app as the source.
2. **Telemetry for a refused service.** OpenTelemetry was gated on the
   `analytics` category rather than on its own service.

Both are fixed in PR #702. **This test will keep failing against production
until that PR is deployed** — it is measuring the live site, not the branch.

## Run this on a schedule

This suite is the only safeguard that catches the original incident class. The
app-side guard warns when `window.__ucCmp` is *absent*, but the incident was a
*misconfigured* CMP — services reporting consent the user never gave — which no
client-side warning detects.

Because it is deliberately excluded from CI (it depends on live third-party
infrastructure), nothing runs it automatically. Run it:

- after any change to the Usercentrics dashboard — service categories, new
  services, consent-required regions;
- after any Usercentrics CMP version bump;
- otherwise periodically, e.g. monthly, saved under a dated `AUDIT_LABEL`.

## Caveats

- **Pre-click only.** A passing run proves nothing is granted *before* the
  banner is touched. It does not verify that consent correctly turns *on* after
  a real Accept — that needs a separate interaction phase.
- **Bot detection matters.** Usercentrics serves a permissive config to headless
  automation (`isBot=true`) under which everything reports as accepted. The
  suite spoofs a normal browser fingerprint and asserts the bot config was not
  served; if that evasion ever breaks, the run fails loudly rather than
  reporting a false all-clear.
- Results depend on live third-party infrastructure and on the CMP dashboard, so
  this suite is deliberately excluded from CI.
