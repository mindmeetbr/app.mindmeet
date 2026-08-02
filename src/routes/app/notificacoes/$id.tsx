import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import { Card, Text, Title } from '@mantine/core'
import { useNotificacaoDetail } from '../../../api/endpoints/notificacoes/notificacoes'
import type { Notificacao } from '../../../api/models'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'

export const Route = createFileRoute('/app/notificacoes/$id')({
  component: NotificacaoIndividual,
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
        {notificacao.data_criacao && (
          <Text size="sm" c="dimmed">
            {dayjs(notificacao.data_criacao).format(
              'dddd, D [de] MMMM [de] YYYY [as] HH:mm'
            )}
          </Text>
        )}
      </Card.Section>
      <Text style={{ whiteSpace: 'pre-wrap' }}>{notificacao.mensagem}</Text>
    </Card>
  )
}

function NotificacaoIndividual() {
  const { id } = Route.useParams()
  const {
    data: notificacao,
    isLoading,
    isError,
    isSuccess,
  } = useNotificacaoDetail(id)
  const queryClient = useQueryClient()

  useAlterarTitle(notificacao?.titulo ?? 'Notificação')

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-pendentes'] })
    }
  }, [isSuccess, queryClient])

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
