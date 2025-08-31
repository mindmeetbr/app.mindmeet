import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import { Card, Text, Title } from '@mantine/core'
import { useNotificacaoDetail } from '../../../api/endpoints/api/api'
import type { Notificacao } from '../../../api/models'

export const Route = createFileRoute('/app/notificacoes/$id')({
  component: RouteComponent,
})

interface CardNotificacaoProps {
  notificacao: Notificacao | undefined
  isLoading: boolean
  isError: boolean
}

function CardNotificacao(props: CardNotificacaoProps) {
  const { notificacao, isLoading, isError } = props

  if (isLoading) {
    return <Text fs="xl">Carregando notificacao...</Text>
  }

  if (isError || notificacao === undefined) {
    return (
      <Text fs="xl">
        Não foi possível carregar a notificação, tente novamente.
      </Text>
    )
  }

  return (
    <Card withBorder padding="lg" radius="md" shadow="sm">
      <Card.Section inheritPadding my="sm">
        <Title order={1}>{notificacao.titulo}</Title>
      </Card.Section>
      <Text style={{ whiteSpace: 'pre-wrap' }}>{notificacao.mensagem}</Text>
      {notificacao.tipo === 'CONFIRMACAO' && notificacao && (
        <Link
          to="/app/aprovar"
          search={{
            id: notificacao.dados_extras.id || '',
            token: notificacao.dados_extras.token! || '',
          }}
        >
          Ir para página de aprovação
        </Link>
      )}
    </Card>
  )
}

function RouteComponent() {
  const { id } = Route.useParams()
  const { data: notificacao, isLoading, isError } = useNotificacaoDetail(id)

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Notificações', href: '/app/notificacoes' },
        { label: notificacao?.titulo || 'Notificação', isCurrentPage: true },
      ]}
      title="Notificações"
      description="Acompanhe e gerencie suas notificações"
    >
      <CardNotificacao
        notificacao={notificacao}
        isLoading={isLoading}
        isError={isError}
      />
    </PageLayout>
  )
}
