"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DeliveryStatus } from "@/lib/status"

const TABS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "returned", label: "Returned" },
]

interface DeliveryStatusTabsProps {
  counts: Partial<Record<DeliveryStatus | "all", number>>
}

/** URL-driven status filter (?status=) for the deliveries list — server page re-queries per tab. */
function DeliveryStatusTabs({ counts }: DeliveryStatusTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get("status") ?? "all"

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("status")
    } else {
      params.set("status", value)
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <Tabs value={active} onValueChange={handleChange}>
      <TabsList>
        {TABS.map((tab) => {
          const count = counts[tab.value as DeliveryStatus | "all"]
          return (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {typeof count === "number" ? (
                <span className="text-muted-foreground ml-1 text-[11px] tabular-nums">{count}</span>
              ) : null}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}

export { DeliveryStatusTabs }
