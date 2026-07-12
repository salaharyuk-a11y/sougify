'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Ban, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { CopyButton } from '@/components/ui/copy-button'
import { StatCard } from '@/components/ui/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatMoney } from '@/lib/money'
import type { Customer, CustomerAddress } from '@/types/db'

import { toggleCustomerBlock } from '../actions'
import { CustomerAddressesCard } from './customer-addresses-card'
import { CustomerNotesCard } from './customer-notes-card'
import { CustomerOrdersTable, type CustomerOrderRow } from './customer-orders-table'
import { CustomerTagsEditor } from './customer-tags-editor'
import { EditCustomerDialog } from './edit-customer-dialog'

interface CustomerDetailProps {
  customer: Customer
  addresses: CustomerAddress[]
  orders: CustomerOrderRow[]
}

export function CustomerDetail({ customer, addresses, orders }: CustomerDetailProps) {
  const router = useRouter()

  async function handleToggleBlock() {
    const result = await toggleCustomerBlock(customer.id, !customer.is_blocked)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(customer.is_blocked ? 'Customer unblocked' : 'Customer blocked')
    router.refresh()
  }

  const aov = customer.orders_count > 0 ? Math.round(customer.total_spent / customer.orders_count) : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{customer.name}</h2>
          {customer.is_blocked ? <Badge variant="destructive">Blocked</Badge> : null}
        </div>
        <div className="flex items-center gap-2">
          <EditCustomerDialog customer={customer} />
          <ConfirmDialog
            trigger={
              <Button variant={customer.is_blocked ? 'outline' : 'destructive'}>
                {customer.is_blocked ? <CheckCircle2 /> : <Ban />}
                {customer.is_blocked ? 'Unblock' : 'Block'}
              </Button>
            }
            title={customer.is_blocked ? 'Unblock this customer?' : 'Block this customer?'}
            description={
              customer.is_blocked
                ? 'This removes their phone number from the blocklist. New orders will no longer be auto-flagged.'
                : 'This adds their phone number to the blocklist. New checkout attempts matching it are auto-flagged as high risk.'
            }
            confirmLabel={customer.is_blocked ? 'Unblock' : 'Block customer'}
            destructive={!customer.is_blocked}
            onConfirm={handleToggleBlock}
          />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-6 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Orders" value={customer.orders_count} />
            <StatCard label="Total spent" value={formatMoney(customer.total_spent)} />
            <StatCard label="Average order" value={formatMoney(aov)} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pb-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground w-16">Phone</span>
                <span className="tabular-nums">{customer.phone}</span>
                <CopyButton text={customer.phone} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground w-16">Email</span>
                <span>{customer.email ?? '—'}</span>
              </div>
            </CardContent>
          </Card>

          <CustomerAddressesCard customerId={customer.id} addresses={addresses} />
          <CustomerNotesCard customerId={customer.id} notes={customer.notes} />
          <CustomerTagsEditor customerId={customer.id} tags={customer.tags ?? []} />
        </TabsContent>

        <TabsContent value="orders" className="pt-4">
          <CustomerOrdersTable orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
