"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, UserX } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DataTable } from "@/components/ui/data-table"
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
import { Switch } from "@/components/ui/switch"
import { formatMoney } from "@/lib/money"
import { cn } from "@/lib/utils"
import type { Rider } from "@/types/db"
import { deactivateRiderAction, upsertRiderAction } from "../actions"

/** Rider row + the active-deliveries count computed by the riders list page.tsx. */
export interface RiderListRow extends Rider {
  activeDeliveries: number
}

function RiderDialog({ rider, trigger }: { rider?: Rider; trigger: React.ReactNode }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState(rider?.name ?? "")
  const [phone, setPhone] = React.useState(rider?.phone ?? "")
  const [vehicle, setVehicle] = React.useState(rider?.vehicle ?? "")
  const [isActive, setIsActive] = React.useState(rider?.is_active ?? true)
  const [userId, setUserId] = React.useState(rider?.user_id ?? "")
  const [loading, setLoading] = React.useState(false)

  function handleOpenChange(next: boolean) {
    if (next) {
      setName(rider?.name ?? "")
      setPhone(rider?.phone ?? "")
      setVehicle(rider?.vehicle ?? "")
      setIsActive(rider?.is_active ?? true)
      setUserId(rider?.user_id ?? "")
    }
    setOpen(next)
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }
    if (!phone.trim()) {
      toast.error("Phone is required")
      return
    }

    setLoading(true)
    try {
      const result = await upsertRiderAction({
        id: rider?.id,
        name: name.trim(),
        phone: phone.trim(),
        vehicle,
        is_active: isActive,
        user_id: userId,
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(rider ? "Rider updated" : "Rider created")
      setOpen(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{rider ? "Edit rider" : "New rider"}</DialogTitle>
          <DialogDescription>Riders can be assigned to deliveries and carry COD cash.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Phone</Label>
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Vehicle</Label>
              <Input
                value={vehicle}
                onChange={(event) => setVehicle(event.target.value)}
                placeholder="motorbike, bicycle..."
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Linked staff user id (optional)</Label>
            <Input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="uuid" />
            <p className="text-muted-foreground text-xs">
              Paste a staff user id to give this rider login scope to their own deliveries.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Active</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={handleSave}>
            {loading ? "Saving..." : "Save rider"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RiderRowActions({ rider }: { rider: Rider }) {
  const router = useRouter()

  async function handleDeactivate() {
    const result = await deactivateRiderAction({ id: rider.id })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success("Rider deactivated")
    router.refresh()
  }

  return (
    <div className="flex justify-end gap-1">
      <RiderDialog
        rider={rider}
        trigger={
          <Button variant="ghost" size="icon">
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
        }
      />
      {rider.is_active ? (
        <ConfirmDialog
          title="Deactivate this rider?"
          description={`"${rider.name}" will no longer be assignable to new deliveries.`}
          confirmLabel="Deactivate"
          destructive
          onConfirm={handleDeactivate}
          trigger={
            <Button variant="ghost" size="icon">
              <UserX className="size-4" />
              <span className="sr-only">Deactivate</span>
            </Button>
          }
        />
      ) : null}
    </div>
  )
}

const columns: ColumnDef<RiderListRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "vehicle", header: "Vehicle", cell: ({ row }) => row.original.vehicle ?? "—" },
  {
    accessorKey: "activeDeliveries",
    header: () => <div className="text-right">Active</div>,
    cell: ({ row }) => <div className="text-right tabular-nums">{row.original.activeDeliveries}</div>,
  },
  {
    accessorKey: "cash_on_hand",
    header: () => <div className="text-right">Cash on hand</div>,
    cell: ({ row }) => (
      <div
        className={cn(
          "text-right tabular-nums",
          row.original.cash_on_hand > 0 ? "font-medium text-amber-700 dark:text-amber-400" : "text-muted-foreground",
        )}
      >
        {formatMoney(row.original.cash_on_hand)}
      </div>
    ),
  },
  {
    id: "is_active",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <RiderRowActions rider={row.original} />,
  },
]

function RidersTable({ riders }: { riders: RiderListRow[] }) {
  return <DataTable columns={columns} data={riders} searchKey="name" searchPlaceholder="Search riders..." />
}

export { RidersTable, RiderDialog }
