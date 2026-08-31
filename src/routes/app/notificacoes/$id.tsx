import { createFileRoute } from '@tanstack/react-router'
import NotificacaoDetailPage from '@/pages/notificacoes/NotificacaoDetailPage'

export const Route = createFileRoute('/app/notificacoes/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <NotificacaoDetailPage id={id} />
}
