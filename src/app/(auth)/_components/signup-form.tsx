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
import { signupAction } from '@/lib/actions/auth'
import { signupSchema, type SignupInput } from '@/lib/actions/auth-schemas'

interface SignupFormProps {
  next?: string
}

export function SignupForm({ next }: SignupFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { full_name: '', email: '', password: '' },
  })

  function onSubmit(values: SignupInput) {
    setFormError(null)
    startTransition(async () => {
      const result = await signupAction({ ...values, next })
      if (!result.ok) {
        setFormError(result.error)
        return
      }
      if (result.data?.needsEmailConfirmation) {
        setSubmittedEmail(values.email)
      }
    })
  }

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : '/login'

  if (submittedEmail) {
    return (
      <Card>
        <CardContent className="py-4">
          <EmptyState
            icon={Mail}
            title="Check your email"
            description={`We sent a confirmation link to ${submittedEmail}. Open it to activate your account.`}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Create your account</CardTitle>
        <CardDescription>Set up Scarpar for your business in a couple of minutes.</CardDescription>
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
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full" disabled={isPending}>
              {isPending ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href={loginHref} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
