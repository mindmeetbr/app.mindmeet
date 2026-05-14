import { createFileRoute, Link } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import { Table, ActionIcon, rem, Flex } from '@mantine/core'
import dayjs from 'dayjs'
import { IconEye, IconTrash } from '@tabler/icons-react'
import { useNotificacaoList } from '../../../api/endpoints/notificacoes/notificacoes'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { usePaginacao } from '../../../hooks/usePaginacao'
import type { Notificacao } from '../../../api/models'
import { TabelaPaginada } from '../../../components/ui/TabelaPaginada'

export const Route = createFileRoute('/app/notificacoes/')({
  component: PaginaNotificacoes,
})

const COLUNAS_NOTIFICACOES = [
  { chave: 'titulo', label: 'Título' },
  { chave: 'data', label: 'Data' },
  { chave: 'lida', label: 'Lida?' },
  { chave: 'acoes', label: 'Opções', largura: 80 },
]

function TabelaNotificacoes() {
  useAlterarTitle('Notificações')
  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao()
  // TODO: adicionar filtros: buscar, marcar como lidas (todas)
  //  filtrar por status, implementar função para apagar

  const { data, isLoading, isError, refetch } = useNotificacaoList(
    { pagina, tamanho },
    { query: { queryKey: ['notificacoes', pagina, tamanho] } }
  )

  const renderLinhaNotificacao = (notificacao: Notificacao) => (
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
  )

  return (
    <TabelaPaginada
      dados={data?.results ?? []}
      total={data?.count ?? 0}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      colunas={COLUNAS_NOTIFICACOES}
      renderLinha={renderLinhaNotificacao}
      pagina={pagina}
      tamanho={tamanho}
      onPaginaChange={setPagina}
      onTamanhoChange={setTamanho}
      mensagemVazia="Nenhuma notificação."
      mensagemErro="Não foi possível carregar suas notificações. Tente novamente."
      comBordaLinhas
      comBordaTabela
    />
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
