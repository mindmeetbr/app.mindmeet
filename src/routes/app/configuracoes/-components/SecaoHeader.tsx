import { Text } from '@mantine/core'
export function SecaoHeader({
  titulo,
  descricao,
}: {
  titulo: string
  descricao?: string
}) {
  return (
    <div>
      <Text fw={600} size="sm" tt="uppercase" c="dimmed" mb={2}>
        {titulo}
      </Text>
      {descricao && (
        <Text size="xs" c="dimmed">
          {descricao}
        </Text>
      )}
    </div>
  )
}
