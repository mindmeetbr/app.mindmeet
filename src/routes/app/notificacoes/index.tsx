import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import { Table, ActionIcon, rem, Flex } from '@mantine/core'
import dayjs from 'dayjs'
import { IconEye, IconTrash } from '@tabler/icons-react'

export const Route = createFileRoute('/app/notificacoes/')({
  component: PaginaNotificacoes,
})

const mockNotificacoes = [
  {
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
  },
  {
    id: 'e644b512-5eee-4cb6-996c-d45749b3ef01',
    titulo: 'Confirmação de estagiário',
    mensagem:
      'Olá pedro.guilherme.dsa,\r\n\r\nO estagiário sabra.lilian (sabra.lilian@email.com) se cadastrou e está aguardando sua aprovação. Por favor, clique no link abaixo para aprovar a conta:',
    lida: true,
    data_criacao: '2025-08-29T18:55:26-03:00',
    tipo: 'CONFIRMACAO',
    dados_extras: {
      id: 'MjZkZGZiODMtOTFhMS00YzBmLWFiNDUtY2JjZmM5YzhlMzRl',
      token: 'cvb8ke-6ac5af4b545080509985dc649c80bc30',
    },
  },
]

function TabelaNotificacoes() {
  // adicionar filtros: texto, lida;
  const linhas = mockNotificacoes.map(notificacao => (
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
  // TODO: chamar api e listar todas as notificações + link para detalhes
  // não lidas mais claras que as lidas
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
