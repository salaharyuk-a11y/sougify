'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginAction } from '@/lib/actions/auth'
import { loginSchema, type LoginInput } from '@/lib/actions/auth-schemas'

interface LoginFormProps {
  next?: string
}

export function LoginForm({ next }: LoginFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  function onSubmit(values: LoginInput) {
    setFormError(null)
    startTransition(async () => {
      const result = await loginAction({ ...values, next })
      if (!result.ok) {
        setFormError(result.error)
      }
    })
  }

  const signupHref = next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'
  const forgotHref = next ? `/forgot-password?next=${encodeURIComponent(next)}` : '/forgot-password'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Log in</CardTitle>
        <CardDescription>Welcome back — enter your details to continue.</CardDescription>
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link href={forgotHref} className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full" disabled={isPending}>
              {isPending ? 'Logging in…' : 'Log in'}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href={signupHref} className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
