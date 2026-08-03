# Consent Mode audit — `after-bridge-removal`

Taken: 2026-08-03T20:36:59.669Z

A first-time visitor who has NOT touched the cookie banner must have no
tracking consent: no non-essential service granted, no granted `gtag`
consent update, and every GA4 hit at `gcs=G100`.

## justdoad.ai (Wix)

- URL: https://www.justdoad.ai/
- Usercentrics settings id: `jnaPMX-WDaJ4Ig`
- consent required: `true`
- overall status: `ALL_DENIED`
- **verdict: PASS ✅**

### Non-essential services granted before any click (0)

_None — correct._

### GA4 hits

| Event | Consent Mode signal |
| --- | --- |
| page_view | ✅ G100 (both denied — correct before consent) |

### Granted consent updates pushed pre-click (0)

_None — correct._

## eclass.justdoad.ch (Next.js)

- URL: https://eclass.justdoad.ch/
- Usercentrics settings id: `jnaPMX-WDaJ4Ig`
- consent required: `true`
- overall status: `ALL_DENIED`
- **verdict: PASS ✅**

### Non-essential services granted before any click (0)

_None — correct._

### GA4 hits

| Event | Consent Mode signal |
| --- | --- |
| page_view | ✅ G100 (both denied — correct before consent) |

### Granted consent updates pushed pre-click (0)

_None — correct._

## Shared configuration

Both sites load the same Usercentrics configuration `jnaPMX-WDaJ4Ig`, so one dashboard change affects both.
