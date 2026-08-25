import { Flex, Grid, rem, Stack } from '@mantine/core'
import { IconBell, IconUsers } from '@tabler/icons-react'
import type { DashboardPsicologoIndependente } from '../../../api/models'
import { CardAgenda } from './partials/CardAgenda'
import { CardEstatistica } from './partials/CardEstatistica'
import { GraficoDistribuicao } from './partials/GraficoDistribuicao'

interface DashboardIndependenteProps {
  dados: DashboardPsicologoIndependente
}

export function DashboardIndependente({ dados }: DashboardIndependenteProps) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <GraficoDistribuicao
          dados={dados.agendamentos_por_estado}
          isGestor={false}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack gap="md" h="100%" w="100%">
          <CardAgenda dados={dados.agenda} />

          <Flex
            gap="md"
            align="stretch"
            direction={{ base: 'column', sm: 'row' }}
            wrap={{ base: 'wrap', sm: 'nowrap' }}
          >
            <CardEstatistica
              label="Total de pacientes"
              value={dados.pacientes.total_ativos}
              color="var(--mantine-color-blue-6)"
              icon={<IconUsers style={{ width: rem(24), height: rem(24) }} />}
            />
            <CardEstatistica
              label="Notificações pendentes"
              value={dados.notificacoes_nao_lidas}
              color="var(--mantine-color-red-6)"
              icon={<IconBell style={{ width: rem(24), height: rem(24) }} />}
            />
          </Flex>
        </Stack>
      </Grid.Col>
    </Grid>
  )
}
