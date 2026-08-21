import { Stack, Text } from '@mantine/core'

interface SecaoHeaderProps {
  titulo: string
  descricao?: string
}

export function SecaoHeader({ titulo, descricao }: SecaoHeaderProps) {
  return (
    <Stack maw="80%" gap="0">
      <Text fw={600} size="md" tt="uppercase">
        {titulo}
      </Text>
      {descricao && (
        <Text size="sm" c="dimmed">
          {descricao}
        </Text>
      )}
    </Stack>
  )
}
