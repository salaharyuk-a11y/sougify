import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

import { requireOrg } from '@/lib/auth'
import { getServerClient } from '@/lib/supabase/server'
import { formatMoney } from '@/lib/money'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface OrderRow {
  id: string
  order_no: string
  customer_name: string
  status: string
  total: number
}

/** Last 8 orders — order_no links to the order, customer, StatusBadge, total. */
export async function OrdersRecentWidget() {
  const ctx = await requireOrg()

  let orders: OrderRow[] = []

  try {
    const supabase = await getServerClient()
    const { data } = await supabase
      .from('orders')
      .select('id, order_no, customer_name, status, total')
      .eq('org_id', ctx.org.id)
      .order('placed_at', { ascending: false })
      .limit(8)

    orders = (data ?? []) as OrderRow[]
  } catch {
    // placeholder-env safety — empty on failure
  }

  return (
    <Card dir="rtl" className="gap-3 p-4">
      <CardHeader className="flex-row items-center justify-between gap-2 p-0">
        <CardTitle className="text-[13px]">أحدث الطلبات</CardTitle>
        <Link href="/admin/orders" className="text-xs text-primary hover:underline">
          عرض الكل
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="لا توجد طلبات بعد" className="py-8" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                      {order.order_no}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-32 truncate">{order.customer_name}</TableCell>
                  <TableCell>
                    <StatusBadge kind="order" value={order.status} />
                  </TableCell>
                  <TableCell className="text-left tabular-nums">{formatMoney(order.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
