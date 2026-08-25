import { Card, Flex, rem, Stack, Text } from '@mantine/core'
import { IconUserQuestion, IconUsers } from '@tabler/icons-react'
import type { InstituicaoResumo } from '../../../../api/models'
import { CardEstatistica } from './CardEstatistica'

interface CardInstituicaoProps {
  dados: InstituicaoResumo
}

export function CardInstituicao({ dados }: CardInstituicaoProps) {
  return (
    <Card withBorder radius="md" p="xl">
      <Stack gap="md">
        <div style={{ minWidth: 0 }}>
          <Text fw={700} fz="lg" truncate>
            {dados.nome}
          </Text>
          <Text c="dimmed" fz="sm" truncate>
            {dados.cnpj}
          </Text>
        </div>

        <Flex
          gap="md"
          align="stretch"
          direction={{ base: 'column', sm: 'row' }}
          wrap={{ base: 'wrap', sm: 'nowrap' }}
        >
          <CardEstatistica
            label="Psicólogos"
            value={dados.total_psicologos}
            color="var(--mantine-color-blue-6)"
            icon={<IconUsers style={{ width: rem(24), height: rem(24) }} />}
          />
          <CardEstatistica
            label="Estagiários"
            value={dados.total_estagiarios}
            color="var(--mantine-color-grape-6)"
            icon={
              <IconUserQuestion style={{ width: rem(24), height: rem(24) }} />
            }
          />
        </Flex>
      </Stack>
    </Card>
  )
}
