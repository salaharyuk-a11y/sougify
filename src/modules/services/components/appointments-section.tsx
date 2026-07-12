'use client'

import { format } from 'date-fns'
import { CalendarClock, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import type { AppointmentStatus } from '@/types/db'

import { deleteAppointment, updateAppointmentStatus } from '../actions'
import type { AppointmentRow } from '../schemas'
import { AppointmentDialog } from './appointment-dialog'

const STATUS_VARIANT: Record<AppointmentStatus, 'secondary' | 'success' | 'warning'> = {
  booked: 'secondary',
  done: 'success',
  cancelled: 'secondary',
  no_show: 'warning',
}

interface AppointmentsSectionProps {
  jobId: string
  appointments: AppointmentRow[]
}

function AppointmentsSection({ jobId, appointments }: AppointmentsSectionProps) {
  async function handleStatus(id: string, status: AppointmentStatus) {
    const result = await updateAppointmentStatus(id, status, jobId)
    if (!result.ok) toast.error(result.error)
  }

  async function handleDelete(id: string) {
    const result = await deleteAppointment(id, jobId)
    if (result.ok) toast.success('Appointment deleted')
    else toast.error(result.error)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Appointments</CardTitle>
        <AppointmentDialog jobId={jobId} />
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No appointments yet"
            description="Schedule the first visit for this job."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-foreground text-[13px] font-medium">{appointment.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {format(new Date(appointment.starts_at), 'd MMM, h:mm a')}
                    {appointment.ends_at ? ` – ${format(new Date(appointment.ends_at), 'h:mm a')}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[appointment.status]}>{appointment.status.replace('_', ' ')}</Badge>
                  {appointment.status === 'booked' ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleStatus(appointment.id, 'done')}>
                        Done
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleStatus(appointment.id, 'no_show')}>
                        No-show
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleStatus(appointment.id, 'cancelled')}>
                        Cancel
                      </Button>
                    </div>
                  ) : null}
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Trash2 />
                        <span className="sr-only">Delete appointment</span>
                      </Button>
                    }
                    title="Delete appointment?"
                    description={`"${appointment.title}" will be permanently removed.`}
                    confirmLabel="Delete"
                    destructive
                    onConfirm={() => handleDelete(appointment.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export { AppointmentsSection }
