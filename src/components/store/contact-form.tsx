'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { inquiryAction } from '@/modules/storefront/actions'
import { inquirySchema, type InquiryInput } from '@/modules/storefront/schemas'

export function ContactForm({ orgSlug }: { orgSlug: string }) {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { orgSlug, name: '', phone: '', email: '', message: '' },
  })

  async function onSubmit(values: InquiryInput) {
    const result = await inquiryAction(values)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setSubmitted(true)
    form.reset({ orgSlug, name: '', phone: '', email: '', message: '' })
  }

  if (submitted) {
    return (
      <p className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        Thanks for reaching out — we&apos;ll get back to you soon.
      </p>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="01XXXXXXXXX" />
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
                  <Input {...field} type="email" placeholder="you@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} placeholder="How can we help?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting ? 'Sending…' : 'Send message'}
        </Button>
      </form>
    </Form>
  )
}
