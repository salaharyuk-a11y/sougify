'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckIcon,
  GraduationCap,
  Store,
  Wrench,
  Building,
  LoaderCircle,
} from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createOrgAction } from '@/lib/actions/onboarding'
import { createOrgSchema, type CreateOrgInput } from '@/lib/actions/onboarding-schemas'
import { cn, slugify } from '@/lib/utils'
import type { Vertical } from '@/types/db'

const VERTICALS: {
  key: Vertical
  label: string
  description: string
  Icon: typeof Store
}[] = [
  { key: 'ecommerce', label: 'تجارة إلكترونية', description: 'إدارة المنتجات والطلبات والمخزون والتوصيل', Icon: Store },
  { key: 'services', label: 'خدمات', description: 'تنظيم الخدمات والعملاء والمواعيد', Icon: Wrench },
  { key: 'courses', label: 'دورات وتدريب', description: 'إدارة الدورات والاشتراكات والمتعلمين', Icon: GraduationCap },
  { key: 'realestate', label: 'عقارات', description: 'عرض العقارات ومتابعة طلبات المهتمين', Icon: Building },
]

interface CreateOrgStepperProps {
  heading: string
}

/** One form instance across both steps so values remain intact when navigating back. */
export function CreateOrgStepper({ heading }: CreateOrgStepperProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [slugTouched, setSlugTouched] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<CreateOrgInput>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: '',
      slug: '',
      phone: '',
      vertical: 'ecommerce',
      seedDemo: false,
    },
  })

  async function goToStep2(): Promise<void> {
    const valid = await form.trigger(['name', 'slug', 'phone'])
    if (valid) setStep(2)
  }

  function onSubmit(values: CreateOrgInput) {
    if (step !== 2) {
      void goToStep2()
      return
    }

    setFormError(null)
    startTransition(async () => {
      const result = await createOrgAction(values)
      if (!result.ok) setFormError(result.error)
    })
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-xl">
      <CardHeader className="gap-3 border-b border-border bg-muted/40 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold">{heading}</CardTitle>
          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            الخطوة {step} من 2
          </span>
        </div>
        <CardDescription className="text-xs leading-6">
          {step === 1
            ? 'أدخل المعلومات الأساسية لمؤسستك.'
            : 'اختر نوع نشاطك حتى نجهز مساحة العمل المناسبة.'}
        </CardDescription>
        <div className="grid grid-cols-2 gap-1.5" aria-label="تقدم الإعداد">
          <span className="h-1 rounded-full bg-primary" />
          <span className={cn('h-1 rounded-full', step === 2 ? 'bg-primary' : 'bg-border')} />
        </div>
      </CardHeader>

      <CardContent className="px-5 py-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            {formError ? (
              <Alert variant="destructive" role="alert">
                <AlertCircle />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            ) : null}

            <div className={cn('flex flex-col gap-4', step !== 1 && 'hidden')}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المؤسسة</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: متجر الأناقة"
                        autoComplete="organization"
                        {...field}
                        onChange={(event) => {
                          field.onChange(event)
                          if (!slugTouched) {
                            form.setValue('slug', slugify(event.target.value), { shouldValidate: true })
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط المؤسسة</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        placeholder="my-store"
                        autoComplete="url"
                        {...field}
                        onChange={(event) => {
                          setSlugTouched(true)
                          field.onChange(slugify(event.target.value))
                        }}
                      />
                    </FormControl>
                    <p className="text-[11px] leading-5 text-muted-foreground">
                      يُستخدم هذا الاسم في رابط متجرك، ويمكن أن يحتوي على أحرف إنجليزية وأرقام وشرطة.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم هاتف النشاط</FormLabel>
                    <FormControl>
                      <Input
                        dir="ltr"
                        className="text-left"
                        placeholder="+213 5XX XX XX XX"
                        autoComplete="tel"
                        inputMode="tel"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-[11px] text-muted-foreground">أدخل رقم الهاتف مع رمز الجزائر +213.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" className="mt-1 w-full gap-2" onClick={() => void goToStep2()}>
                متابعة
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <div className={cn('flex flex-col gap-4', step !== 2 && 'hidden')}>
              <FormField
                control={form.control}
                name="vertical"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ما نوع نشاطك؟</FormLabel>
                    <div className="grid grid-cols-1 gap-2">
                      {VERTICALS.map(({ key, label, description, Icon }) => {
                        const selected = field.value === key

                        return (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => field.onChange(key)}
                            className={cn(
                              'flex items-center gap-3 rounded-lg border p-3 text-right transition-colors duration-150',
                              selected
                                ? 'border-primary bg-primary/5'
                                : 'border-border bg-background hover:bg-accent/60',
                            )}
                          >
                            <span className={cn(
                              'flex size-10 shrink-0 items-center justify-center rounded-lg',
                              selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                            )}>
                              <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-foreground">{label}</span>
                              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{description}</span>
                            </span>
                            <span className={cn(
                              'flex size-5 shrink-0 items-center justify-center rounded-full border',
                              selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                            )}>
                              {selected ? <Check className="size-3.5" aria-hidden="true" /> : null}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seedDemo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="flex flex-col gap-0.5">
                      <FormLabel className="text-xs font-medium">إضافة بيانات تجريبية</FormLabel>
                      <p className="text-[11px] leading-5 text-muted-foreground">
                        أضف منتجات وطلبات افتراضية للتعرف على المنصة. اترك الخيار غير محدد إذا كنت تريد البدء ببياناتك الحقيقية.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => setStep(1)} disabled={isPending}>
                  <ArrowRight className="size-4" aria-hidden="true" />
                  رجوع
                </Button>
                <Button type="submit" className="flex-1 gap-2" disabled={isPending}>
                  {isPending ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      جارٍ الإنشاء...
                    </>
                  ) : (
                    <>
                      إنشاء المؤسسة
                      <CheckIcon className="size-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
