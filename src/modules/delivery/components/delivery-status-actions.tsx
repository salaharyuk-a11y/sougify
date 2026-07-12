"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DELIVERY_STATUS_FLOW, type DeliveryStatus } from "@/lib/status"
import type { Rider } from "@/types/db"
import {
  assignRiderAction,
  markDeliveredAction,
  markFailedAction,
  markInTransitAction,
  markPickedUpAction,
  markReturnedAction,
} from "../actions"

interface DeliveryStatusActionsProps {
  deliveryId: string
  status: DeliveryStatus
  hasOtp: boolean
  codAmount: number
  riders: Rider[]
}

/** Stepper action row — one button per status DELIVERY_STATUS_FLOW allows next. */
function DeliveryStatusActions({ deliveryId, status, hasOtp, codAmount, riders }: DeliveryStatusActionsProps) {
  const router = useRouter()
  const [pending, setPending] = React.useState<DeliveryStatus | null>(null)

  const nextStatuses = DELIVERY_STATUS_FLOW[status]
  if (!nextStatuses || nextStatuses.length === 0) {
    return <p className="text-muted-foreground text-sm">This delivery is in a final state.</p>
  }

  async function runDirect(next: DeliveryStatus, action: () => Promise<{ ok: boolean; error?: string }>) {
    setPending(next)
    try {
      const result = await action()
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Delivery updated")
      router.refresh()
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {nextStatuses.includes("assigned") ? (
        <AssignRiderDialog deliveryId={deliveryId} riders={riders} onDone={() => router.refresh()} />
      ) : null}

      {nextStatuses.includes("picked_up") ? (
        <Button
          disabled={pending !== null}
          onClick={() => runDirect("picked_up", () => markPickedUpAction({ delivery_id: deliveryId }))}
        >
          {pending === "picked_up" ? "Updating..." : "Mark Picked Up"}
        </Button>
      ) : null}

      {nextStatuses.includes("in_transit") ? (
        <Button
          variant="secondary"
          disabled={pending !== null}
          onClick={() => runDirect("in_transit", () => markInTransitAction({ delivery_id: deliveryId }))}
        >
          {pending === "in_transit" ? "Updating..." : "Mark In Transit"}
        </Button>
      ) : null}

      {nextStatuses.includes("delivered") ? (
        <DeliverDialog
          deliveryId={deliveryId}
          hasOtp={hasOtp}
          codAmount={codAmount}
          onDone={() => router.refresh()}
        />
      ) : null}

      {nextStatuses.includes("failed") ? (
        <FailDialog deliveryId={deliveryId} onDone={() => router.refresh()} />
      ) : null}

      {nextStatuses.includes("returned") ? (
        <ReturnDialog deliveryId={deliveryId} onDone={() => router.refresh()} />
      ) : null}
    </div>
  )
}

function AssignRiderDialog({
  deliveryId,
  riders,
  onDone,
}: {
  deliveryId: string
  riders: Rider[]
  onDone: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [riderId, setRiderId] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleAssign() {
    if (!riderId) {
      toast.error("Select a rider")
      return
    }
    setLoading(true)
    try {
      const result = await assignRiderAction({ delivery_id: deliveryId, rider_id: riderId })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Rider assigned")
      setOpen(false)
      onDone()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Assign Rider</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign rider</DialogTitle>
          <DialogDescription>Choose which rider will pick up this delivery.</DialogDescription>
        </DialogHeader>
        <Select value={riderId} onValueChange={setRiderId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select rider" />
          </SelectTrigger>
          <SelectContent>
            {riders.map((rider) => (
              <SelectItem key={rider.id} value={rider.id}>
                {rider.name} — {rider.phone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button disabled={loading} onClick={handleAssign}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeliverDialog({
  deliveryId,
  hasOtp,
  codAmount,
  onDone,
}: {
  deliveryId: string
  hasOtp: boolean
  codAmount: number
  onDone: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [otp, setOtp] = React.useState("")
  const [codCollected, setCodCollected] = React.useState(codAmount > 0)
  const [loading, setLoading] = React.useState(false)

  async function handleDeliver() {
    setLoading(true)
    try {
      const result = await markDeliveredAction({
        delivery_id: deliveryId,
        otp: otp || undefined,
        cod_collected: codCollected,
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Delivery marked delivered")
      setOpen(false)
      onDone()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Mark Delivered</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark delivered</DialogTitle>
          <DialogDescription>Confirm this delivery reached the recipient.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {hasOtp ? (
            <div className="flex flex-col gap-1.5">
              <Label>OTP from recipient</Label>
              <Input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                maxLength={4}
                placeholder="4-digit code"
              />
            </div>
          ) : null}
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>COD collected</Label>
            <Switch checked={codCollected} onCheckedChange={setCodCollected} />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={handleDeliver}>
            {loading ? "Saving..." : "Confirm delivered"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FailDialog({ deliveryId, onDone }: { deliveryId: string; onDone: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleFail() {
    if (!reason.trim()) {
      toast.error("Reason is required")
      return
    }
    setLoading(true)
    try {
      const result = await markFailedAction({ delivery_id: deliveryId, reason })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Delivery marked failed")
      setOpen(false)
      onDone()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Mark Failed</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark delivery failed</DialogTitle>
          <DialogDescription>The order stays dispatched — you can retry or return it later.</DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason (customer unreachable, refused, wrong address...)"
        />
        <DialogFooter>
          <Button variant="destructive" disabled={loading} onClick={handleFail}>
            {loading ? "Saving..." : "Confirm failed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReturnDialog({ deliveryId, onDone }: { deliveryId: string; onDone: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [note, setNote] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function handleReturn() {
    setLoading(true)
    try {
      const result = await markReturnedAction({ delivery_id: deliveryId, note: note || undefined })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Delivery marked returned")
      setOpen(false)
      onDone()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Mark Returned</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark delivery returned</DialogTitle>
          <DialogDescription>This also marks the order as returned.</DialogDescription>
        </DialogHeader>
        <Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Note (optional)" />
        <DialogFooter>
          <Button disabled={loading} onClick={handleReturn}>
            {loading ? "Saving..." : "Confirm returned"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeliveryStatusActions }
