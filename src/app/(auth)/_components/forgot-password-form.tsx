'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Mail } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { forgotAction } from '@/lib/actions/auth'
import { forgotSchema, type ForgotInput } from '@/lib/actions/auth-schemas'

interface ForgotPasswordFormProps {
  next?: string
}

export function ForgotPasswordForm({ next }: ForgotPasswordFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(values: ForgotInput) {
    setFormError(null)
    startTransition(async () => {
      const result = await forgotAction(values)
      if (!result.ok) {
        setFormError(result.error)
        return
      }
      setSubmitted(true)
    })
  }

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login'

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-4">
          <EmptyState
            icon={Mail}
            title="Check your email"
            description="If an account exists for that address, we've sent a link to reset your password."
            action={
              <Button asChild variant="secondary" size="sm">
                <Link href={loginHref}>Back to log in</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reset your password</CardTitle>
        <CardDescription>Enter your email and we&apos;ll send you a reset link.</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {formError ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@business.com" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full" disabled={isPending}>
              {isPending ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Remembered your password?{' '}
          <Link href={loginHref} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
