import { Card, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import type { Notificacao } from '@/api/models'

interface CardNotificacaoProps {
  notificacao: Notificacao | undefined
  isLoading: boolean
  isError: boolean
}

export default function CardNotificacao(props: CardNotificacaoProps) {
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
