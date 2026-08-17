# certs/

## `supabase-root-2021.pem`

The **Supabase Root 2021 CA**, pinned so the database connection can verify TLS
properly instead of turning verification off.

Supabase's pooler presents a chain signed by their own root:

```
*.pooler.supabase.com
  └─ Supabase Intermediate 2021 CA
       └─ Supabase Root 2021 CA   ← this file, self-signed
```

That root is not in any operating system trust store, so node-postgres rejects
the connection with `SELF_SIGNED_CERT_IN_CHAIN`. The common workaround is
`ssl: { rejectUnauthorized: false }`, which silences the error by accepting any
certificate at all — including one presented by whoever is between you and the
database. Pinning the real root keeps verification on.

## Verify this before trusting it

This file was captured from the TLS handshake itself, which means it is
trust-on-first-use: it protects every connection from here on, but it cannot
prove the first one was not intercepted.

**Confirm the fingerprint out of band.** In the Supabase dashboard go to
*Project Settings → Database → SSL Configuration*, download the certificate, and
check it matches:

```
SHA-256  80:70:25:AD:50:D4:ED:21:9D:2C:9C:7D:29:9C:00:4F:
         82:4E:B0:0C:F7:F6:5A:FE:F6:07:D0:7B:72:E6:CA:FA
```

Recompute it any time with:

```bash
openssl x509 -in certs/supabase-root-2021.pem -noout -fingerprint -sha256
```

If it does not match, do not use this file — replace it with the download and
raise it, because a mismatch means the captured chain was not Supabase's.

## Why it is committed

It is a public certificate authority certificate, not a secret. Committing it
means a clean checkout connects with verification intact rather than needing an
out-of-band setup step that someone will skip.
