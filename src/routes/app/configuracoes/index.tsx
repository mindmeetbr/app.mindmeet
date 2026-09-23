import { createFileRoute } from '@tanstack/react-router'
import ConfiguracoesPage from '@/pages/configuracoes/ConfiguracoesPage'

export const Route = createFileRoute('/app/configuracoes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ConfiguracoesPage />
}
