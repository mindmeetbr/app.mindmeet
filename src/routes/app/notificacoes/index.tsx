import { createFileRoute } from '@tanstack/react-router'
import NotificacaoListPage from '@/pages/notificacoes/NotificacaoListPage'

export const Route = createFileRoute('/app/notificacoes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <NotificacaoListPage />
}
