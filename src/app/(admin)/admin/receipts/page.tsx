import { requireOrg } from '@/lib/auth'
import { requireModule } from '@/lib/modules'
import { getServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RecentOrdersTable, type RecentOrderRow } from '@/modules/receipts/components/recent-orders-table'
import {
  RecentDeliveriesTable,
  type RecentDeliveryRow,
} from '@/modules/receipts/components/recent-deliveries-table'

export const dynamic = 'force-dynamic'

export default async function ReceiptsPage() {
  const ctx = await requireOrg()
  requireModule(ctx.org, 'receipts')

  const supabase = await getServerClient()

  const [{ data: orders }, { data: deliveries }] = await Promise.all([
    supabase
      .from('orders')
      .select('id, order_no, customer_name, total, payment_status, placed_at')
      .eq('org_id', ctx.org.id)
      .order('placed_at', { ascending: false })
      .limit(25),
    supabase
      .from('deliveries')
      .select('id, delivery_no, recipient_name, cod_amount, status, created_at')
      .eq('org_id', ctx.org.id)
      .order('created_at', { ascending: false })
      .limit(25),
  ])

  return (
    <div>
      <PageHeader
        title="Receipts"
        description="Print invoices, thermal receipts, and courier labels."
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How printing works</CardTitle>
            <CardDescription>
              Invoice, thermal, and label pages render as plain HTML styled for print — use your
              browser&apos;s print dialog to save as PDF or send to a printer, thermal, or label
              device. Invoice numbers (INV-…) are issued the first time an order&apos;s invoice is
              printed and stay fixed after that.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">Recent orders</h2>
          <RecentOrdersTable orders={(orders ?? []) as RecentOrderRow[]} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">Recent deliveries</h2>
          <RecentDeliveriesTable deliveries={(deliveries ?? []) as RecentDeliveryRow[]} />
        </div>
      </div>
    </div>
  )
}
