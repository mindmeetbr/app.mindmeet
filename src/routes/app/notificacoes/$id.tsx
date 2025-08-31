import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import { Card, Text, Title } from '@mantine/core'

export const Route = createFileRoute('/app/notificacoes/$id')({
  component: RouteComponent,
})

const mockNotificacao = {
  id: 'd82fe288-f4ea-41c2-aa30-19382a4b2dd5',
  titulo: 'Confirmação de estagiário',
  mensagem:
    'Olá pedro.guilherme.dsa,\r\n\r\nO estagiário v.marques (v.marques@email.com) se cadastrou e está aguardando sua aprovação. Por favor, clique no link abaixo para aprovar a conta:',
  lida: false,
  data_criacao: '2025-08-30T14:08:47-03:00',
  tipo: 'CONFIRMACAO',
  dados_extras: {
    id: 'ZDYyYmM2MDYtZDVjYy00OGY4LTg1YTAtZjFmNGZlNjkyODdj',
    token: 'cvcpyn-fe8c547f6a7a2bc70ae900476c111c54',
  },
}

function CardNotificacao() {
  // const { id } = Route.useParams();
  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Card.Section inheritPadding my="sm">
        <Title order={1}>{mockNotificacao.titulo}</Title>
      </Card.Section>
      <Text style={{ whiteSpace: 'pre-wrap' }}>{mockNotificacao.mensagem}</Text>
      {mockNotificacao.tipo === 'CONFIRMACAO' &&
        mockNotificacao.dados_extras && (
          <Link
            to="/app/aprovar"
            search={{
              id: mockNotificacao.dados_extras.id,
              token: mockNotificacao.dados_extras.token,
            }}
          >
            Ir para página de aprovação
          </Link>
        )}
    </Card>
  )
}

function RouteComponent() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Notificações', href: '/app/notificacoes' },
        { label: mockNotificacao.titulo, isCurrentPage: true },
      ]}
      title="Notificações"
      description="Acompanhe e gerencie suas notificações"
    >
      <CardNotificacao />
    </PageLayout>
  )
}
