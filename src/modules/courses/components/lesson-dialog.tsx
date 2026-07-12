'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Lesson } from '@/types/db'

import { createLesson, updateLesson } from '../actions'
import { lessonFormSchema, type LessonFormValues } from '../schemas'

interface LessonDialogProps {
  courseId: string
  lesson?: Lesson
  open: boolean
  onOpenChange: (open: boolean) => void
}

function LessonDialog({ courseId, lesson, open, onOpenChange }: LessonDialogProps) {
  const isEdit = Boolean(lesson)

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: lesson?.title ?? '',
      video_url: lesson?.video_url ?? '',
      content: lesson?.content ?? '',
      is_free: lesson?.is_free ?? false,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: lesson?.title ?? '',
        video_url: lesson?.video_url ?? '',
        content: lesson?.content ?? '',
        is_free: lesson?.is_free ?? false,
      })
    }
    // Only re-sync when the dialog opens or the target lesson changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lesson])

  async function onSubmit(values: LessonFormValues) {
    const result =
      isEdit && lesson ? await updateLesson(lesson.id, courseId, values) : await createLesson(courseId, values)

    if (result.ok) {
      toast.success(isEdit ? 'Lesson updated' : 'Lesson added')
      onOpenChange(false)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit lesson' : 'Add lesson'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes / content</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_free"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Free preview lesson</FormLabel>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add lesson'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { LessonDialog }
