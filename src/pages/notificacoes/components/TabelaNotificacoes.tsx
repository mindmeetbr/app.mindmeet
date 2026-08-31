import { ActionIcon, Flex, rem, Table } from '@mantine/core'
import { IconEye, IconTrash } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import type { useNotificacaoList } from '@/api/endpoints/notificacoes/notificacoes'
import type { Notificacao, PaginatedNotificacaoList } from '@/api/models'
import { TabelaPaginada } from '@/components/ui/TabelaPaginada'

const COLUNAS_NOTIFICACOES = [
  { chave: 'titulo', label: 'Título' },
  { chave: 'data', label: 'Data' },
  { chave: 'lida', label: 'Lida?' },
  { chave: 'acoes', label: 'Opções', largura: 80 },
]

interface TabelaNotificacoesProps {
  dados: PaginatedNotificacaoList | undefined
  isLoading: boolean
  isError: boolean
  refetch: ReturnType<typeof useNotificacaoList>['refetch']

  pagina: number
  tamanho: number
  setPagina: (pagina: number) => void
  setTamanho: (tamanho: number) => void
}

export default function TabelaNotificacoes({
  dados,
  isLoading,
  isError,
  refetch,
  pagina,
  tamanho,
  setPagina,
  setTamanho,
}: TabelaNotificacoesProps) {
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
      dados={dados?.results ?? []}
      total={dados?.count ?? 0}
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
