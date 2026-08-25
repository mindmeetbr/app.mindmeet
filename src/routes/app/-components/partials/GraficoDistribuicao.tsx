import { Card } from '@mantine/core'
import type { ChartData, ChartOptions } from 'chart.js'
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { AgendamentosPorEstado } from '../../../../api/models'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface GraficoDistribuicaoProps {
  dados: AgendamentosPorEstado
  isGestor: boolean
}

const CORES = {
  agendado: '#2c6bc3',
  realizado: '#22c55e',
  cancelado: '#dc1818',
}

export function GraficoDistribuicao({
  dados,
  isGestor,
}: GraficoDistribuicaoProps) {
  const totalAgendamentos = dados.agendado + dados.realizado + dados.cancelado
  const tituloGrafico = isGestor
    ? 'Agendamentos da sua instituição'
    : 'Seus agendamentos'

  const dadosGrafico: ChartData<'doughnut'> =
    totalAgendamentos > 0
      ? {
          labels: ['Agendado', 'Realizado', 'Cancelado'],
          datasets: [
            {
              label: 'Agendamentos',
              data: [dados.agendado, dados.realizado, dados.cancelado],
              backgroundColor: [
                CORES.agendado,
                CORES.realizado,
                CORES.cancelado,
              ],
              hoverOffset: 16,
              borderRadius: 12,
            },
          ],
        }
      : {
          labels: ['Sem agendamentos'],
          datasets: [
            {
              data: [1],
              backgroundColor: '#828282',
              hoverOffset: 16,
            },
          ],
        }

  const opcoesGrafico: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: tituloGrafico,
        font: { size: 12 },
      },
    },
  }

  return (
    <Card withBorder h={{ base: '15rem', sm: '17.5rem', md: '20rem' }}>
      <Doughnut options={opcoesGrafico} data={dadosGrafico} />
    </Card>
  )
}
