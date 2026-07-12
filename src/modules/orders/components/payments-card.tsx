'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Wallet } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatMoney } from '@/lib/money'
import { rejectPaymentAction, verifyPaymentAction } from '@/modules/orders/actions'
import { RecordPaymentDialog } from './record-payment-dialog'
import type { Payment } from '@/types/db'

interface PaymentsCardProps {
  orderId: string
  payments: Payment[]
}

function PaymentsCard({ orderId, payments }: PaymentsCardProps) {
  const router = useRouter()
  const [busyId, setBusyId] = React.useState<string | null>(null)

  async function handleVerify(paymentId: string) {
    setBusyId(paymentId)
    try {
      const result = await verifyPaymentAction(paymentId)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success('Payment verified')
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function handleReject(paymentId: string) {
    setBusyId(paymentId)
    try {
      const result = await rejectPaymentAction({ paymentId })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success('Payment rejected')
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Payments</CardTitle>
        <RecordPaymentDialog orderId={orderId} />
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No payments recorded"
            description="Record an advance, full, or balance payment for this order."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kind</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="capitalize">{payment.kind}</TableCell>
                  <TableCell className="uppercase">{payment.method}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(payment.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge kind="payment" value={payment.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {payment.provider_ref || payment.sender_number || '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {payment.verified_at ? format(new Date(payment.verified_at), 'd MMM, h:mm a') : '—'}
                  </TableCell>
                  <TableCell>
                    {payment.status === 'pending' ? (
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" disabled={busyId === payment.id} onClick={() => handleVerify(payment.id)}>
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === payment.id}
                          onClick={() => handleReject(payment.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

export { PaymentsCard }
