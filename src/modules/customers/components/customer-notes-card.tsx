'use client'

import * as React from 'react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

import { updateCustomerNotes } from '../actions'

export function CustomerNotesCard({ customerId, notes }: { customerId: string; notes: string | null }) {
  const [value, setValue] = React.useState(notes ?? '')
  const [saving, setSaving] = React.useState(false)
  const savedRef = React.useRef(notes ?? '')

  async function handleBlur() {
    if (value === savedRef.current) return
    setSaving(true)
    const result = await updateCustomerNotes(customerId, value)
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    savedRef.current = value
    toast.success('Notes saved')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          placeholder="Internal notes about this customer..."
          className="min-h-24"
          disabled={saving}
        />
      </CardContent>
    </Card>
  )
}
