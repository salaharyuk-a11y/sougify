// Zod schema shared between the onboarding client stepper and
// src/lib/actions/onboarding.ts. Kept out of onboarding.ts itself: a 'use server'
// file may only export async functions, so the schema object lives here instead.
import { z } from 'zod'

export const createOrgSchema = z.object({
  name: z.string().trim().min(2, 'Enter your organization name').max(120),
  slug: z
    .string()
    .trim()
    .min(2, 'Enter a URL slug')
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens only'),
  phone: z.string().trim().min(6, 'Enter a valid phone number').max(20),
  vertical: z.enum(['ecommerce', 'courses', 'services', 'realestate']),
  seedDemo: z.boolean(),
})

export type CreateOrgInput = z.infer<typeof createOrgSchema>
