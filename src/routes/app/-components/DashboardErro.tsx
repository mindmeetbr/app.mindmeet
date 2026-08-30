import { Button, Card, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react'

interface DashboardErroProps {
  onTentarNovamente?: () => void
}

export function DashboardErro({ onTentarNovamente }: DashboardErroProps) {
  return (
    <Card withBorder radius="md" p="xl">
      <Stack align="center" gap="sm" py="xl">
        <IconAlertCircle size={40} color="var(--mantine-color-red-6)" />
        <Text fw={600}>Não foi possível carregar o dashboard</Text>
        <Text c="dimmed" fz="sm" ta="center">
          Ocorreu um erro ao buscar os dados. Tente novamente em instantes.
        </Text>
        {onTentarNovamente && (
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={onTentarNovamente}
          >
            Tentar novamente
          </Button>
        )}
      </Stack>
    </Card>
  )
}
