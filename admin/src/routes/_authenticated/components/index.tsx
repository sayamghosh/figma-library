import { createFileRoute } from '@tanstack/react-router'
import { ComponentsModeration } from '@/features/components'

export const Route = createFileRoute('/_authenticated/components/')({
  component: ComponentsModeration,
})
