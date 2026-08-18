import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * The field wrapper every input shares — docs/04 §30, docs/06 §C1.
 *
 * It exists so the accessibility contract is written once rather than
 * remembered eleven times: a real `<label>` bound by `htmlFor`, hint and error
 * text linked through `aria-describedby`, and `aria-invalid` set when the field
 * has failed.
 *
 * The error carries a text marker as well as colour. docs/06 §C1 forbids
 * conveying information by colour alone, and an error message in red that reads
 * the same as help text in grey is exactly that.
 */
export function Field({
  name,
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  name: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  /** Receives the ids to wire into the control. */
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
  className?: string
}) {
  const id = `field-${name}`
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="font-display text-body-sm font-medium text-(--ink)">
        {label}
        {required && (
          <span className="ml-1 text-(--accent-text)" aria-hidden="true">
            *
          </span>
        )}
        {!required && (
          <span className="ml-2 font-body font-normal text-(--ink-muted)">Optional</span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-body-sm text-(--ink-muted)">
          {hint}
        </p>
      )}

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error && (
        <p id={errorId} className="flex gap-2 text-body-sm text-error">
          <span aria-hidden="true">✕</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

/** Shared input chrome. Square corners — the 45° cut never appears on inputs. */
export const inputClass = (invalid?: boolean) =>
  cn(
    'w-full border bg-(--surface) px-4 py-3 font-body text-body text-(--ink)',
    'placeholder:text-(--ink-muted)',
    invalid ? 'border-error' : 'border-(--line) hover:border-(--ink-muted)',
  )
