import { Card, Group, Skeleton, Text, ThemeIcon } from '@mantine/core'
import type { ReactNode } from 'react'

interface CardEstatisticaProps {
  label: string
  value: ReactNode
  description?: string
  color?: string
  icon?: ReactNode
  loading?: boolean
}

export function CardEstatistica({
  label,
  value,
  description,
  color = 'blue',
  icon,
  loading = false,
}: CardEstatisticaProps) {
  return (
    <Card withBorder radius="md" p="xl" w="100%">
      <Group justify="space-between" align="center" wrap="nowrap">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {label}
          </Text>

          {loading ? (
            <Skeleton height={28} width={60} mt={4} />
          ) : (
            <Text fw={700} fz="xl">
              {value}
            </Text>
          )}

          {description && (
            <Text c="dimmed" fz="sm">
              {description}
            </Text>
          )}
        </div>

        {icon && (
          <ThemeIcon
            color={color}
            variant="light"
            size="lg"
            radius="md"
            aria-hidden
          >
            {icon}
          </ThemeIcon>
        )}
      </Group>
    </Card>
  )
}
