/**
 * Renders one or more JSON-LD graphs. Nulls are dropped, so a factory that
 * declines to emit — `faqSchema` with no FAQs, `contactPointSchema` with no
 * contact details — costs the caller nothing.
 *
 * The payload is serialised with `<` escaped, which closes the one injection
 * route a JSON-LD script tag has: a `</script>` sequence inside string content.
 */
export function JsonLd({ schemas }: { schemas: (Record<string, unknown> | null)[] }) {
  const present = schemas.filter(Boolean)
  if (present.length === 0) return null

  return (
    <>
      {present.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  )
}
