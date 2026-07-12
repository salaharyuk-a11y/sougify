import { PageHeader } from '@/components/ui/page-header'
import { requireOrg } from '@/lib/auth'
import { requireModule } from '@/lib/modules'
import { getServerClient } from '@/lib/supabase/server'

import { ProductForm, toCategoryOptions } from '@/modules/catalog/components/product-form'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const ctx = await requireOrg()
  requireModule(ctx.org, 'catalog')

  const supabase = await getServerClient()
  const { data: categoryRows } = await supabase
    .from('categories')
    .select('id, name, parent_id')
    .eq('org_id', ctx.org.id)
    .order('name')

  const categories = toCategoryOptions(
    (categoryRows ?? []) as { id: string; name: string; parent_id: string | null }[],
  )

  return (
    <div>
      <PageHeader title="New product" backHref="/admin/products" />
      <ProductForm mode="create" categories={categories} />
    </div>
  )
}
