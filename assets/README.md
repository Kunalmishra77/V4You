# assets/

Client-supplied source files. Claude Code reads from here.
Full specification: `docs/08-asset-checklist.md`.

```
brand/         logo-full.svg, logo-full-light.svg, logo-mark.svg,
               favicon.svg, favicon.png, og-default.png
clients/       {client-slug}.svg  +  permissions.csv   ← REQUIRED for any logo to render
team/          {name-slug}.jpg    +  team.csv
case-studies/  {slug}/content.md, kpis.csv, screens/, architecture.svg
```

## Two hard rules

1. **`clients/permissions.csv` gates every client logo.** No row with
   `logo_permitted = yes`, no logo on the site. There is no override.

2. **`kpis.csv` requires `evidence_type`** on every row — one of `measured`, `modelled`,
   `estimated`, `client-reported`. The CMS rejects a metric without it.

Anything missing here is logged to `MISSING-ASSETS.md` at the repo root and the affected
component renders its documented empty state. The build does not stall.
