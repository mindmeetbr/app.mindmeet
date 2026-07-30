import { Card, Group, Table, TextInput, rem } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { ControlePaginacao } from './ControlePaginacao'
import { TableEmptyState } from './TableEmptyState'

interface ColunasTabela {
  chave: string
  label: string
  // largura opcional para colunas que precisam de tamanho fixo, como "Ações"
  largura?: number
}

interface TabelaPaginadaProps<T> {
  // dados e estado da requisição
  dados: T[]
  total: number
  isLoading: boolean
  isError: boolean
  onRetry?: () => void

  // definição das colunas e renderização das linhas
  colunas: ColunasTabela[]
  renderLinha: (item: T) => ReactNode

  // paginação (recebe diretamente o retorno do usePaginacao)
  pagina: number
  tamanho: number
  onPaginaChange: (pagina: number) => void
  onTamanhoChange: (tamanho: number) => void

  // busca opcional
  termoBusca?: string
  onBuscaChange?: (termo: string) => void
  placeholderBusca?: string

  // mensagens de estado vazio e erro
  mensagemVazia?: string
  mensagemErro?: string

  // customização visual da tabela
  comBordaTabela?: boolean
  comBordaLinhas?: boolean

  // slot extra para ações no header
  acoes?: ReactNode
}

export function TabelaPaginada<T>({
  dados,
  total,
  isLoading,
  isError,
  onRetry,
  colunas,
  renderLinha,
  pagina,
  tamanho,
  onPaginaChange,
  onTamanhoChange,
  termoBusca,
  onBuscaChange,
  placeholderBusca = 'Buscar...',
  mensagemVazia = 'Nenhum item encontrado.',
  mensagemErro = 'Não foi possível carregar os dados. Tente novamente.',
  comBordaTabela = false,
  comBordaLinhas = false,
  acoes,
}: TabelaPaginadaProps<T>) {
  const temHeader = onBuscaChange || acoes
  const estaVazia = !isLoading && !isError && dados.length === 0

  return (
    <Card withBorder radius="md" p="md">
      {temHeader && (
        <Group mb="md" justify="space-between">
          {onBuscaChange ? (
            <TextInput
              placeholder={placeholderBusca}
              leftSection={
                <IconSearch style={{ width: rem(16), height: rem(16) }} />
              }
              value={termoBusca}
              onChange={e => onBuscaChange(e.target.value)}
              style={{ flex: 1 }}
            />
          ) : (
            <div style={{ flex: 1 }} />
          )}
          {acoes}
        </Group>
      )}

      <Table.ScrollContainer minWidth={800} style={{ overflowX: 'auto' }}>
        <Table
          striped
          highlightOnHover
          withTableBorder={comBordaTabela}
          withRowBorders={comBordaLinhas}
        >
          <Table.Thead>
            <Table.Tr>
              {colunas.map(coluna => (
                <Table.Th
                  key={coluna.chave}
                  style={coluna.largura ? { width: coluna.largura } : undefined}
                >
                  {coluna.label}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            <TableEmptyState
              isLoading={isLoading}
              isError={isError}
              isEmpty={estaVazia}
              onRetry={onRetry}
              colSpan={colunas.length}
              errorMessage={mensagemErro}
              emptyMessage={mensagemVazia}
            />
            {!isLoading && !isError && dados.map(renderLinha)}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <ControlePaginacao
        pagina={pagina}
        tamanho={tamanho}
        total={total}
        onPaginaChange={onPaginaChange}
        onTamanhoChange={onTamanhoChange}
      />
    </Card>
  )
}
