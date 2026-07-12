import type { Metadata } from 'next'

import { ResetPasswordForm } from '../_components/reset-password-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Set a new password — Scarpar' }

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
