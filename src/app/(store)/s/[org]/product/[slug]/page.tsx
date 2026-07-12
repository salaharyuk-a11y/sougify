import { notFound } from 'next/navigation'

import { type Lang } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media-url'
import { getOrgSettings, settingStr } from '@/lib/settings'
import { getAnonClient } from '@/lib/supabase/anon'
import type { PageProps } from '@/lib/types'
import type { Product, ProductVariant } from '@/types/db'

import { getStoreOrg } from '@/components/store/get-store-org'
import { ProductGallery } from '@/components/store/product-gallery'
import { ProductPurchasePanel } from '@/components/store/product-purchase-panel'
import { ReviewsSection } from '@/components/store/reviews-section'

export const dynamic = 'force-dynamic'

interface ImageJoinRow {
  id: string
  position: number
  media: { path: string } | { path: string }[] | null
}

export default async function ProductPage({ params }: PageProps<{ org: string; slug: string }>) {
  const { org: orgSlug, slug } = await params
  const org = await getStoreOrg(orgSlug)
  if (!org) notFound()

  const settings = await getOrgSettings(org.id)
  const lang = settingStr(settings, 'localization.language') as Lang

  const supabase = getAnonClient()
  const { data: productRow } = await supabase
    .from('products')
    .select('*')
    .eq('org_id', org.id)
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (!productRow) notFound()
  const product = productRow as Product

  const [{ data: variantRows }, { data: imageRows }] = await Promise.all([
    supabase
      .from('product_variants')
      .select('*')
      .eq('org_id', org.id)
      .eq('product_id', product.id)
      .order('position', { ascending: true }),
    supabase
      .from('product_images')
      .select('id, position, media:media_id(path)')
      .eq('org_id', org.id)
      .eq('product_id', product.id)
      .order('position', { ascending: true }),
  ])

  const variants = (variantRows ?? []) as ProductVariant[]

  const imageUrls = ((imageRows ?? []) as unknown as ImageJoinRow[])
    .map((row) => {
      const media = Array.isArray(row.media) ? row.media[0] : row.media
      return media?.path ? mediaUrl(media.path) : null
    })
    .filter((url): url is string => Boolean(url))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={imageUrls} name={product.name} />
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">{product.name}</h1>
          <ProductPurchasePanel product={product} variants={variants} image={imageUrls[0] ?? null} lang={lang} />
          {product.description ? (
            <p className="border-t border-border pt-4 text-sm whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>

      <ReviewsSection orgId={org.id} orgSlug={org.slug} productId={product.id} />
    </div>
  )
}
