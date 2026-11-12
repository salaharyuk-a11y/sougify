'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { MODULE_LIST } from '@/modules/registry'
import type { ModuleKey } from '@/modules/types'
import type { Org } from '@/types/db'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { updateOrgProfileAction } from '@/modules/settings/actions'
import { orgProfileSchema, type OrgProfileInput } from '@/modules/settings/schemas'

const MODULE_COPY: Record<ModuleKey, { name: string; description: string }> = {
  catalog: { name: 'المنتجات والمخزون', description: 'إدارة المنتجات والتصنيفات والكميات.' },
  orders: { name: 'الطلبات', description: 'متابعة الطلبات من الإنشاء إلى التسليم والمرتجعات.' },
  pos: { name: 'نقطة البيع', description: 'تسجيل المبيعات المباشرة داخل المتجر.' },
  customers: { name: 'العملاء', description: 'ملفات العملاء وسجل الطلبات وقائمة الحظر.' },
  discounts: { name: 'التخفيضات', description: 'إنشاء أكواد الخصم والعروض الترويجية.' },
  delivery: { name: 'التوصيل', description: 'مناطق التوصيل والسائقون ومتابعة الدفع عند الاستلام.' },
  receipts: { name: 'الفواتير والإيصالات', description: 'طباعة الفواتير والإيصالات وملصقات الشحن.' },
  cms: { name: 'إدارة المحتوى', description: 'إدارة صفحات المتجر والقوائم.' },
  storefront: { name: 'واجهة المتجر', description: 'إعدادات المظهر والصفحات وتجربة الشراء.' },
  reports: { name: 'التقارير', description: 'تقارير المبيعات والطلبات والتوصيل والأداء المالي.' },
  expenses: { name: 'المصاريف', description: 'تسجيل مصاريف النشاط وتصنيفها.' },
  reviews: { name: 'التقييمات', description: 'إدارة تقييمات العملاء ومراجعتها.' },
  courses: { name: 'الدورات', description: 'إدارة الدورات والدروس والتسجيلات.' },
  services: { name: 'الخدمات', description: 'إدارة الخدمات والعروض والمواعيد.' },
  listings: { name: 'العقارات والإعلانات', description: 'إدارة العقارات والإعلانات واستفسارات المهتمين.' },
}

function OrgProfileSection({ org }: { org: Org }) {
  const form = useForm<OrgProfileInput>({
    resolver: zodResolver(orgProfileSchema),
    defaultValues: {
      name: org.name,
      phone: org.phone ?? '',
      email: org.email ?? '',
      address: org.address ?? '',
      timezone: 'Africa/Algiers',
      enabled_modules: org.enabled_modules as ModuleKey[],
    },
  })

  async function onSubmit(values: OrgProfileInput) {
    const result = await updateOrgProfileAction(values)
    if (result.ok) {
      toast.success('تم حفظ بيانات المؤسسة')
      form.reset(values)
    } else {
      toast.error(result.error)
    }
  }

  const enabledModules = form.watch('enabled_modules')

  return (
    <Card id="section-organization" className="scroll-mt-6">
      <CardHeader>
        <CardTitle className="text-base">بيانات المؤسسة</CardTitle>
        <p className="text-sm text-muted-foreground">المعلومات الأساسية التي تظهر في متجرك وفواتيرك.</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المؤسسة أو المتجر</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl><Input dir="ltr" inputMode="tel" placeholder="+213..." {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl><Input dir="ltr" type="email" {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>العنوان</FormLabel>
                  <FormControl><Input {...field} value={field.value ?? ''} placeholder="الولاية، البلدية، العنوان..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex flex-col gap-2">
                <Label>العملة المعتمدة</Label>
                <Input value="DZD — الدينار الجزائري (دج)" disabled dir="ltr" />
                <p className="text-xs leading-5 text-muted-foreground">
                  ستُعتمد هذه العملة عند حفظ بيانات المؤسسة. تبقى القيم الرقمية المسجلة كما هي دون تحويل.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>المنطقة الزمنية</Label>
                <Input value="Africa/Algiers (UTC+1)" disabled dir="ltr" />
                <p className="text-xs text-muted-foreground">توقيت الجزائر يُطبّق عند حفظ بيانات المؤسسة.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>نوع النشاط</Label>
                <div><Badge variant="outline" className="capitalize">{org.vertical}</Badge></div>
              </div>
            </div>

            <Separator />

            <section className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-medium">وحدات العمل</h3>
                <p className="text-xs text-muted-foreground">فعّل الأدوات التي تحتاجها مؤسستك فقط.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MODULE_LIST.map((mod) => {
                  const checked = enabledModules?.includes(mod.key) ?? false
                  return (
                    <label key={mod.key} htmlFor={`module-${mod.key}`} className="flex cursor-pointer items-start gap-2 rounded-md border p-3 transition-colors hover:bg-accent/40">
                      <Checkbox
                        id={`module-${mod.key}`}
                        checked={checked}
                        onCheckedChange={(next) => {
                          const selected = new Set(form.getValues('enabled_modules'))
                          if (next) selected.add(mod.key)
                          else selected.delete(mod.key)
                          form.setValue('enabled_modules', Array.from(selected), { shouldDirty: true })
                        }}
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{MODULE_COPY[mod.key].name}</span>
                        <span className="text-xs leading-5 text-muted-foreground">{MODULE_COPY[mod.key].description}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
              <Alert>
                <AlertTitle>تعطيل وحدة لا يحذف بياناتها</AlertTitle>
                <AlertDescription>سيؤدي التعطيل إلى إخفاء صفحات الوحدة فقط. يمكنك إعادة تفعيلها لاحقاً لاسترجاع الوصول إلى بياناتها.</AlertDescription>
              </Alert>
            </section>

            <div className="flex justify-start">
              <Button type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'جارٍ الحفظ…' : 'حفظ بيانات المؤسسة'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export { OrgProfileSection }
