import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import { Table, ActionIcon, rem, Flex, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { IconEye, IconTrash } from '@tabler/icons-react'
import { useNotificacaoList } from '../../../api/endpoints/api/api'

export const Route = createFileRoute('/app/notificacoes/')({
  component: PaginaNotificacoes,
})

function TabelaNotificacoes() {
  // adicionar filtros: texto, lida;

  const { data: notificacoes, isLoading, isError } = useNotificacaoList()

  if (isLoading) {
    return <Text fs="xl">Carregando notificações...</Text>
  }

  if (isError) {
    return (
      <Text fs="xl">
        Não foi possível carregar suas notificações, tente novamente.
      </Text>
    )
  }

  if (!notificacoes) {
    return <p>Nenhuma notificação encontrada.</p>
  }

  const linhas = notificacoes.map(notificacao => (
    <Table.Tr key={notificacao.id}>
      <Table.Td>{notificacao.titulo}</Table.Td>
      <Table.Td>
        {dayjs(notificacao.data_criacao).format('DD/MM/YYYY [às] HH:mm')}
      </Table.Td>
      <Table.Td>{notificacao.lida ? 'Sim' : 'Não'}</Table.Td>
      <Table.Td>
        <Flex gap="sm">
          <Link to="/app/notificacoes/$id" params={{ id: notificacao.id }}>
            <ActionIcon variant="light" color="blue" size="sm" aria-label="Ler">
              <IconEye style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={() => console.log('notificação apagada')}
            aria-label="Apagar"
          >
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          </ActionIcon>
        </Flex>
      </Table.Td>
    </Table.Tr>
  ))
  return (
    <Table.ScrollContainer minWidth={800}>
      <Table withTableBorder withRowBorders striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Título</Table.Th>
            <Table.Th>Data</Table.Th>
            <Table.Th>Lida?</Table.Th>
            <Table.Th>Opções</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{linhas}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}

function PaginaNotificacoes() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Notificações', isCurrentPage: true },
      ]}
      title="Notificações"
      description="Acompanhe e gerencie suas notificações"
    >
      <TabelaNotificacoes />
    </PageLayout>
  )
}
