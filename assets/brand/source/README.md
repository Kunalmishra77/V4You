# assets/brand/source/

The raster originals the brand vectors are traced from. `scripts/vectorise-logo.py`
reads this folder; keeping the inputs inside the repo is what makes the brand
pipeline reproducible from a clean checkout.

| File | What it is |
|---|---|
| `logo-2048.png` | Full lockup — mark plus "V4YOU TECHNOLOGIES" wordmark |
| `favicon-2048.png` | The mark alone |

## Provenance — read this before treating these as originals

**These two files are reconstructions, not the client's original uploads.**

The client supplied `Logo.png` and `fevicon.png` (2048 × 2048, bone background,
AI-generated, each carrying a small generator watermark in the bottom-right
corner). Those files were traced to vector successfully, and then deleted in
error by an overly broad cleanup glob on 2026-08-17. No backup existed — they sat
outside the repository, and the repository was initialised after they were read.

What is here now was rendered back out of `assets/brand/logo-full.svg` and
`assets/brand/logo-mark.svg` at the original 2048 × 2048 on the bone canvas. The
geometry, the letterforms and the colours are the originals', because the vectors
are a trace of them. Two things differ:

- the generator watermark is gone, which is an improvement
- the artwork is optically centred rather than sitting where the originals placed it

Nothing in the build depends on these files. Every asset the site serves is
generated from the SVGs in the parent folder, and the SVGs are committed. This
folder exists so the trace can be re-run and reviewed.

**Do not re-run the trace against these reconstructions and commit the result.**
The committed SVGs are a first-generation trace of the client's real files.
Tracing a render of that trace is second-generation and loses a little of the
anti-aliased edge detail the first pass resolved — measurably, the paths come out
about 12% smaller because there is less real edge information to follow. The
committed vectors are the better artefact. Re-run the trace only when a genuine
new original replaces the files here.

**If the client still holds `Logo.png` and `fevicon.png`, replace these two files
with them and re-run `pnpm assets:vectorise && pnpm assets:brand`.** That is
logged as an open item in `MISSING-ASSETS.md`.
