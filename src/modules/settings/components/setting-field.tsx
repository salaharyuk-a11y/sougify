'use client'

import * as React from 'react'
import { Info } from 'lucide-react'
import { fromPaisa, toPaisa } from '@/lib/money'
import type { SettingDef } from '@/lib/settings/registry'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function isMoneyField(def: SettingDef): boolean {
  return def.type === 'number' && /\(دج\)/.test(def.label)
}

interface SettingFieldProps {
  def: SettingDef
  value: unknown
  disabled?: boolean
  onChange: (key: string, value: unknown) => void
  onValidityChange?: (key: string, valid: boolean) => void
}

function FieldLabel({ def }: { def: SettingDef }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={def.key}>{def.label}</Label>
      {def.help ? (
        <Tooltip>
          <TooltipTrigger type="button" className="text-muted-foreground"><Info className="size-3.5" /></TooltipTrigger>
          <TooltipContent>{def.help}</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  )
}

function SettingField({ def, value, disabled, onChange, onValidityChange }: SettingFieldProps) {
  const [jsonText, setJsonText] = React.useState(() => JSON.stringify(value ?? null, null, 2))
  const [jsonError, setJsonError] = React.useState<string | null>(null)
  const lastEmitted = React.useRef<unknown>(value)

  React.useEffect(() => {
    if (Object.is(value, lastEmitted.current)) return
    setJsonText(JSON.stringify(value ?? null, null, 2))
    setJsonError(null)
    lastEmitted.current = value
  }, [value])

  if (def.type === 'info') {
    return (
      <div className="flex flex-col gap-1 border-b py-3 last:border-b-0">
        <FieldLabel def={def} />
        <p className="text-sm font-medium text-foreground">{String(def.default)}</p>
      </div>
    )
  }

  if (def.type === 'boolean') {
    return (
      <div className="flex items-center justify-between gap-6 border-b py-3 last:border-b-0">
        <FieldLabel def={def} />
        <Switch id={def.key} checked={Boolean(value)} disabled={disabled} onCheckedChange={(checked) => onChange(def.key, checked)} />
      </div>
    )
  }

  if (def.type === 'select') {
    return (
      <div className="flex items-center justify-between gap-6 border-b py-3 last:border-b-0 max-sm:items-start max-sm:flex-col">
        <FieldLabel def={def} />
        <Select value={typeof value === 'string' ? value : ''} disabled={disabled} onValueChange={(next) => onChange(def.key, next)}>
          <SelectTrigger id={def.key} className="w-full sm:w-64"><SelectValue /></SelectTrigger>
          <SelectContent>{def.options?.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    )
  }

  if (def.type === 'json') {
    return (
      <div className="flex flex-col gap-1.5 border-b py-3 last:border-b-0">
        <FieldLabel def={def} />
        <Textarea
          id={def.key}
          value={jsonText}
          disabled={disabled}
          rows={Math.min(7, Math.max(3, jsonText.split('\n').length))}
          dir="ltr"
          className="font-mono text-xs"
          onChange={(event) => {
            const text = event.target.value
            setJsonText(text)
            try {
              const parsed = JSON.parse(text)
              setJsonError(null)
              lastEmitted.current = parsed
              onValidityChange?.(def.key, true)
              onChange(def.key, parsed)
            } catch {
              setJsonError('صيغة JSON غير صحيحة')
              onValidityChange?.(def.key, false)
            }
          }}
        />
        {jsonError ? <p className="text-xs text-destructive">{jsonError}</p> : null}
      </div>
    )
  }

  if (def.type === 'number') {
    const money = isMoneyField(def)
    const displayValue = money ? fromPaisa(Number(value) || 0) : Number(value) || 0
    return (
      <div className="flex items-center justify-between gap-6 border-b py-3 last:border-b-0 max-sm:items-start max-sm:flex-col">
        <FieldLabel def={def} />
        <div className="flex w-full items-center gap-2 sm:w-64">
          {money ? <span className="text-sm font-medium text-muted-foreground">دج</span> : null}
          <Input
            id={def.key}
            type="number"
            min="0"
            step={money ? '0.01' : '1'}
            value={displayValue}
            disabled={disabled}
            className="text-left tabular-nums"
            onChange={(event) => onChange(def.key, money ? toPaisa(event.target.value) : Number(event.target.value) || 0)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-6 border-b py-3 last:border-b-0 max-sm:items-start max-sm:flex-col">
      <FieldLabel def={def} />
      <Input id={def.key} type="text" value={typeof value === 'string' ? value : ''} disabled={disabled} className="w-full sm:w-64" onChange={(event) => onChange(def.key, event.target.value)} />
    </div>
  )
}

export { SettingField }
