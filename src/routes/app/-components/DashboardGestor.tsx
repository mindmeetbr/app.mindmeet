import { Grid, Stack } from '@mantine/core'
import type {
  Agenda,
  DashboardGestor as DashboardGestorResponse,
} from '../../../api/models'
import { CardAgenda } from './partials/CardAgenda'
import { CardInstituicao } from './partials/CardInstituicao'
import { GraficoDistribuicao } from './partials/GraficoDistribuicao'

interface DashboardGestorProps {
  dados: DashboardGestorResponse
}

export function DashboardGestor({ dados }: DashboardGestorProps) {
  const agendamentosPorEstado = dados.agendamentos_institucionais.por_estado
  const dadosAgenda: Agenda = {
    hoje: {
      total: dados.agendamentos_institucionais.hoje.total,
      proximo_horario: null,
    },
    proxima_semana: dados.agendamentos_institucionais.proxima_semana,
  }

  return (
    <Grid align="stretch">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <GraficoDistribuicao dados={agendamentosPorEstado} isGestor={true} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack gap="md" h="100%">
          <CardInstituicao dados={dados.instituicao} />
          <CardAgenda dados={dadosAgenda} />
        </Stack>
      </Grid.Col>
    </Grid>
  )
}
