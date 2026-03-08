import { Group, Pagination, Select, Text } from '@mantine/core'

const OPCOES_TAMANHO = ['5', '10', '25', '50']

interface ControlePaginacaoProps {
  pagina: number
  tamanho: number
  total: number
  onPaginaChange: (pagina: number) => void
  onTamanhoChange: (tamanho: number) => void
}

// barra de controles de paginação reutilizável
export function ControlePaginacao({
  pagina,
  tamanho,
  total,
  onPaginaChange,
  onTamanhoChange,
}: ControlePaginacaoProps) {
  if (total === 0) return null

  const totalPaginas = Math.ceil(total / tamanho)

  return (
    <Group justify="space-between" mt="md" wrap="wrap" gap="sm">
      <Text size="sm" c="dimmed">
        {total} {total === 1 ? 'item' : 'itens'} no total
      </Text>

      <Group gap="sm">
        <Text size="sm" c="dimmed">
          Itens por página:
        </Text>
        <Select
          data={OPCOES_TAMANHO}
          value={String(tamanho)}
          onChange={value => onTamanhoChange(Number(value ?? tamanho))}
          size="xs"
          w={70}
          allowDeselect={false}
        />
      </Group>

      <Pagination
        total={totalPaginas}
        value={pagina}
        onChange={onPaginaChange}
        size="sm"
      />
    </Group>
  )
}
