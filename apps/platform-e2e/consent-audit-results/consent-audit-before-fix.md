# Consent Mode audit — `before-fix`

Taken: 2026-08-03T13:10:45.672Z

A first-time visitor who has NOT touched the cookie banner must have no
tracking consent: no non-essential service granted, no granted `gtag`
consent update, and every GA4 hit at `gcs=G100`.

## justdoad.ai (Wix)

- URL: https://www.justdoad.ai/
- Usercentrics settings id: `jnaPMX-WDaJ4Ig`
- consent required: `true`
- overall status: `SOME_ACCEPTED`
- **verdict: FAIL ❌**

### Non-essential services granted before any click (7)

| Service | Category | Consent type |
| --- | --- | --- |
| DoubleClick Ad | marketing | IMPLICIT |
| Google Ads | marketing | IMPLICIT |
| Google Analytics | marketing | IMPLICIT |
| Google Tag Manager | marketing | IMPLICIT |
| LinkedIn Insight Tag | marketing | IMPLICIT |
| LinkedIn Plugin | functional | IMPLICIT |
| YouTube Video | functional | IMPLICIT |

### GA4 hits

| Event | Consent Mode signal |
| --- | --- |
| page_view | ✅ G100 (both denied — correct before consent) |
| user_engagement | ❌ G101 (analytics_storage GRANTED) |

### Granted consent updates pushed pre-click (2)

- `{"ad_storage":"denied","ad_personalization":"denied","ad_user_data":"denied","analytics_storage":"granted"}`
- `{"ad_storage":"denied","ad_personalization":"denied","ad_user_data":"denied","analytics_storage":"granted"}`

## eclass.justdoad.ch (Next.js)

- URL: https://eclass.justdoad.ch/
- Usercentrics settings id: `jnaPMX-WDaJ4Ig`
- consent required: `true`
- overall status: `SOME_ACCEPTED`
- **verdict: FAIL ❌**

### Non-essential services granted before any click (7)

| Service | Category | Consent type |
| --- | --- | --- |
| DoubleClick Ad | marketing | IMPLICIT |
| Google Ads | marketing | IMPLICIT |
| Google Analytics | marketing | IMPLICIT |
| Google Tag Manager | marketing | IMPLICIT |
| LinkedIn Insight Tag | marketing | IMPLICIT |
| LinkedIn Plugin | functional | IMPLICIT |
| YouTube Video | functional | IMPLICIT |

### GA4 hits

| Event | Consent Mode signal |
| --- | --- |
| scroll | ✅ G100 (both denied — correct before consent) |
| page_view | ✅ G100 (both denied — correct before consent) |
| user_engagement | ❌ G101 (analytics_storage GRANTED) |
| user_engagement | ❌ G111 (analytics + ad storage GRANTED) |

### Granted consent updates pushed pre-click (3)

- `{"ad_storage":"denied","ad_personalization":"denied","ad_user_data":"denied","analytics_storage":"granted"}`
- `{"ad_storage":"denied","ad_personalization":"denied","ad_user_data":"denied","analytics_storage":"granted"}`
- `{"analytics_storage":"granted","ad_storage":"granted","ad_user_data":"granted","ad_personalization":"granted","personalization_storage":"granted"}`

## Shared configuration

Both sites load the same Usercentrics configuration `jnaPMX-WDaJ4Ig`, so one dashboard change affects both.
