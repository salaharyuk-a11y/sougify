import type { Metadata } from 'next'

import type { PageProps } from '@/lib/types'

import { ForgotPasswordForm } from '../_components/forgot-password-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Reset password — Scarpar' }

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams
  const next = typeof params.next === 'string' ? params.next : undefined

  return <ForgotPasswordForm next={next} />
}
