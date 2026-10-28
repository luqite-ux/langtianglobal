'use client'

import { useActionState, useId, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { submitInquiry } from '@/app/actions/inquiry'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { initialInquiryState, type InquiryField } from '@/lib/inquiries/types'
import { cn } from '@/lib/utils'
import { CaptchaSlot } from '@/components/inquiry/captcha-slot'

const generalContexts = [
  'Product inquiry',
  'Sample request',
  'Customization or specification question',
  'Quotation request',
  'Other',
]

type InquiryFormProps = {
  /** Product names offered as inquiry context. Supplied by the server page so data stays replaceable. */
  productNames?: string[]
  /** Preselected context, for example `Product: LWRT Board`. */
  defaultContext?: string
  quantityLabel?: string
  submitLabel?: string
  idPrefix?: string
}

const selectClass =
  'border-input bg-background h-11 w-full min-w-0 rounded-md border px-3 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:border-destructive disabled:opacity-60 md:text-sm'

export function InquiryForm({
  productNames = [],
  defaultContext,
  quantityLabel = 'Quantity or specification',
  submitLabel = 'Send inquiry',
  idPrefix,
}: InquiryFormProps) {
  const reactId = useId()
  const prefix = idPrefix ?? `inquiry-${reactId.replace(/:/g, '')}`
  const pathname = usePathname()
  const [state, formAction, isPending] = useActionState(submitInquiry, initialInquiryState)
  const summaryRef = useRef<HTMLDivElement>(null)

  const contexts = [
    ...generalContexts.slice(0, 1),
    ...productNames.map((n) => `Product: ${n}`),
    ...generalContexts.slice(1),
  ]
  if (defaultContext && !contexts.includes(defaultContext)) contexts.unshift(defaultContext)

  const values = state.values ?? {}
  const errors = state.fieldErrors ?? {}
  const hasFieldErrors = Object.keys(errors).length > 0

  if (state.status === 'success') {
    return (
      <div role="status" className="bg-card border p-6 sm:p-8">
        <CheckCircle2 aria-hidden="true" className="text-primary size-8" />
        <h3 className="mt-4 text-xl font-bold">Inquiry received</h3>
        <p className="text-muted-foreground mt-2 leading-relaxed">{state.message}</p>
      </div>
    )
  }

  const fieldProps = (name: InquiryField) => ({
    id: `${prefix}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${prefix}-${name}-error` : undefined,
  })

  return (
    <form action={formAction} noValidate className="bg-card border p-5 sm:p-8" aria-busy={isPending}>
      <input type="hidden" name="sourcePath" value={pathname} />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${prefix}-website`}>Leave this field empty</label>
        <input id={`${prefix}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && state.message && (
        <div ref={summaryRef} className="mb-6">
          <Alert variant="destructive" role="alert">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>{hasFieldErrors ? 'Check your details' : 'Inquiry not sent'}</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <FieldGroup className="gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor={`${prefix}-name`}>Name</FieldLabel>
            <Input
              {...fieldProps('name')}
              autoComplete="name"
              required
              defaultValue={values.name}
              className="h-11"
            />
            {errors.name && <FieldError id={`${prefix}-name-error`}>{errors.name}</FieldError>}
          </Field>
          <Field data-invalid={errors.company ? true : undefined}>
            <FieldLabel htmlFor={`${prefix}-company`}>Company</FieldLabel>
            <Input
              {...fieldProps('company')}
              autoComplete="organization"
              required
              defaultValue={values.company}
              className="h-11"
            />
            {errors.company && (
              <FieldError id={`${prefix}-company-error`}>{errors.company}</FieldError>
            )}
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor={`${prefix}-email`}>Email</FieldLabel>
            <Input
              {...fieldProps('email')}
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              defaultValue={values.email}
              className="h-11"
            />
            {errors.email && <FieldError id={`${prefix}-email-error`}>{errors.email}</FieldError>}
          </Field>
          <Field data-invalid={errors.phone ? true : undefined}>
            <FieldLabel htmlFor={`${prefix}-phone`}>
              Phone <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input
              {...fieldProps('phone')}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              defaultValue={values.phone}
              className="h-11"
            />
            {errors.phone && <FieldError id={`${prefix}-phone-error`}>{errors.phone}</FieldError>}
          </Field>
        </div>

        <Field data-invalid={errors.context ? true : undefined}>
          <FieldLabel htmlFor={`${prefix}-context`}>Product or inquiry context</FieldLabel>
          <select
            {...fieldProps('context')}
            required
            defaultValue={values.context ?? defaultContext ?? ''}
            className={cn(selectClass)}
          >
            <option value="" disabled>
              Select a context
            </option>
            {contexts.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.context && (
            <FieldError id={`${prefix}-context-error`}>{errors.context}</FieldError>
          )}
        </Field>

        <Field data-invalid={errors.quantity ? true : undefined}>
          <FieldLabel htmlFor={`${prefix}-quantity`}>
            {quantityLabel} <span className="text-muted-foreground font-normal">(optional)</span>
          </FieldLabel>
          <Input
            {...fieldProps('quantity')}
            defaultValue={values.quantity}
            className="h-11"
            aria-describedby={`${prefix}-quantity-hint`}
          />
          <FieldDescription id={`${prefix}-quantity-hint`}>
            For example thickness, areal weight, sheet or roll size, and expected volume.
          </FieldDescription>
        </Field>

        <Field data-invalid={errors.message ? true : undefined}>
          <FieldLabel htmlFor={`${prefix}-message`}>Message</FieldLabel>
          <Textarea
            {...fieldProps('message')}
            required
            rows={6}
            defaultValue={values.message}
            placeholder="Tell us the part, the application and any drawing or specification requirements."
          />
          {errors.message && (
            <FieldError id={`${prefix}-message-error`}>{errors.message}</FieldError>
          )}
        </Field>

        <CaptchaSlot />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={isPending} className="h-12 px-8 sm:w-auto">
            {isPending ? (
              <>
                <Spinner aria-hidden="true" />
                Sending…
              </>
            ) : (
              submitLabel
            )}
          </Button>
          <p className="text-muted-foreground text-sm" aria-live="polite">
            {isPending ? 'Sending your inquiry, please wait.' : 'We reply by email.'}
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}
