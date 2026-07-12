import { notFound } from 'next/navigation'

import { requireOrg } from '@/lib/auth'
import { requireModule } from '@/lib/modules'
import { getServerClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/ui/page-header'
import type { PageProps } from '@/lib/types'
import type { Customer, CustomerAddress } from '@/types/db'

import { CustomerDetail } from '@/modules/customers/components/customer-detail'
import type { CustomerOrderRow } from '@/modules/customers/components/customer-orders-table'

export const dynamic = 'force-dynamic'

export default async function CustomerDetailPage({ params }: PageProps<{ id: string }>) {
  const { id } = await params
  const ctx = await requireOrg()
  requireModule(ctx.org, 'customers')

  const supabase = await getServerClient()
  const [{ data: customerRow }, { data: addressRows }, { data: orderRows }] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).eq('org_id', ctx.org.id).single(),
    supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', id)
      .eq('org_id', ctx.org.id)
      .order('is_default', { ascending: false }),
    supabase
      .from('orders')
      .select('id, order_no, placed_at, total, status, payment_status')
      .eq('customer_id', id)
      .eq('org_id', ctx.org.id)
      .order('placed_at', { ascending: false })
      .limit(50),
  ])

  if (!customerRow) notFound()

  const customer = customerRow as Customer
  const addresses = (addressRows ?? []) as CustomerAddress[]
  const orders = (orderRows ?? []) as CustomerOrderRow[]

  return (
    <div className="px-6 py-6">
      <PageHeader title={customer.name} backHref="/admin/customers" />
      <CustomerDetail customer={customer} addresses={addresses} orders={orders} />
    </div>
  )
}
