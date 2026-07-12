'use server'

import { revalidatePath } from 'next/cache'

import { audit } from '@/lib/audit'
import { requireOrg, requireRole } from '@/lib/auth'
import { toPaisa } from '@/lib/money'
import { getServerClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/types'
import type { Expense } from '@/types/db'

import {
  deleteExpenseSchema,
  expenseSchema,
  updateExpenseSchema,
  type DeleteExpenseInput,
  type ExpenseFormValues,
  type UpdateExpenseInput,
} from './schemas'

// Expenses follow the standard RLS rule (docs/architecture.md §3): INSERT/UPDATE/DELETE are
// restricted to owner|admin|manager (no "staff where noted" exception for this table) — 'manager'
// is the app-level floor so a blocked mutation fails with a clean redirect, not a raw RLS error.

export async function createExpenseAction(input: ExpenseFormValues): Promise<ActionResult<Expense>> {
  const ctx = await requireOrg()
  requireRole(ctx, 'manager')

  const parsed = expenseSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid expense' }
  }

  try {
    const supabase = await getServerClient()
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        org_id: ctx.org.id,
        category: parsed.data.category,
        amount: toPaisa(parsed.data.amount),
        spent_at: parsed.data.spent_at,
        note: parsed.data.note || null,
        media_id: parsed.data.media_id || null,
        created_by: ctx.user.id,
      })
      .select()
      .single()

    if (error || !data) {
      return { ok: false, error: error?.message ?? 'Failed to save expense' }
    }

    const expense = data as Expense
    audit(ctx, 'expense.create', 'expense', expense.id, null, expense)
    revalidatePath('/admin/expenses')
    return { ok: true, data: expense }
  } catch (error) {
    console.error('[expenses] createExpenseAction failed', error)
    return { ok: false, error: 'Failed to save expense' }
  }
}

export async function updateExpenseAction(input: UpdateExpenseInput): Promise<ActionResult<Expense>> {
  const ctx = await requireOrg()
  requireRole(ctx, 'manager')

  const parsed = updateExpenseSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid expense' }
  }

  try {
    const supabase = await getServerClient()

    const { data: before } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', parsed.data.id)
      .eq('org_id', ctx.org.id)
      .single()

    const { data, error } = await supabase
      .from('expenses')
      .update({
        category: parsed.data.category,
        amount: toPaisa(parsed.data.amount),
        spent_at: parsed.data.spent_at,
        note: parsed.data.note || null,
        media_id: parsed.data.media_id || null,
      })
      .eq('id', parsed.data.id)
      .eq('org_id', ctx.org.id)
      .select()
      .single()

    if (error || !data) {
      return { ok: false, error: error?.message ?? 'Failed to update expense' }
    }

    const expense = data as Expense
    audit(ctx, 'expense.update', 'expense', expense.id, before ?? null, expense)
    revalidatePath('/admin/expenses')
    return { ok: true, data: expense }
  } catch (error) {
    console.error('[expenses] updateExpenseAction failed', error)
    return { ok: false, error: 'Failed to update expense' }
  }
}

export async function deleteExpenseAction(input: DeleteExpenseInput): Promise<ActionResult> {
  const ctx = await requireOrg()
  requireRole(ctx, 'manager')

  const parsed = deleteExpenseSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Invalid expense id' }
  }

  try {
    const supabase = await getServerClient()

    const { data: before } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', parsed.data.id)
      .eq('org_id', ctx.org.id)
      .single()

    const { error } = await supabase.from('expenses').delete().eq('id', parsed.data.id).eq('org_id', ctx.org.id)

    if (error) {
      return { ok: false, error: error.message }
    }

    audit(ctx, 'expense.delete', 'expense', parsed.data.id, before ?? null, null)
    revalidatePath('/admin/expenses')
    return { ok: true }
  } catch (error) {
    console.error('[expenses] deleteExpenseAction failed', error)
    return { ok: false, error: 'Failed to delete expense' }
  }
}
