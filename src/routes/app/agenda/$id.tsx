import { createFileRoute, useRouter } from '@tanstack/react-router'

import { PageLayout } from '../../../components/layout'
import { Card, Stack, Text, Divider, rem, Grid, Title } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

import { AgendamentoTipoEnum, EstadoEnum } from '../../../api/models'
import type { Agendamento } from '../../../api/models'

import {
  getEstadoBadge,
  getTipoBadge,
  formatarDataHora,
  formatarData,
  formatarHora,
} from '../../../utils/agenda'
export const Route = createFileRoute('/app/agenda/$id')({
  component: AgendamentoDetalhePage,
})

const mockAgendamento: Agendamento = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  data: '2025-11-13',
  tipo: AgendamentoTipoEnum.online,
  horario_inicio: '01:41:04.550Z',
  horario_fim: '02:41:04.550Z',
  paciente_nome: 'Marina Oliveira',
  paciente_email: 'marina.oliveira@example.com',
  paciente_numero_telefone: '(81) 98877-6655',
  estado: EstadoEnum.cancelado,
  motivo_cancelamento: 'Está gripada',
}

function AgendamentoDetalhePage() {
  const router = useRouter()
  const { id } = Route.useParams()
  const agendamento = mockAgendamento

  const tituloLayout = `Agendamento com ${agendamento.paciente_nome} (${formatarDataHora(
    agendamento.data,
    agendamento.horario_inicio
  )})`

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Agenda', href: '/app/agenda' },
        {
          label: `Agendamento com ${agendamento.paciente_nome}`,
          isCurrentPage: true,
        },
      ]}
      title={tituloLayout}
      primaryAction={{
        label: 'Editar',
        icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
        variant: 'light',
        onClick: () =>
          router.navigate({ to: '/app/agenda/novo', search: { id } }),
      }}
    >
      <Stack gap="lg">
        <Card withBorder p="xl" radius="md">
          <Stack gap="md">
            <Title order={4}>Informações do Paciente</Title>
            <Divider />
            <Grid>
              <Grid.Col span={4}>
                <Text fw={600}>Nome do(a) Paciente:</Text>
                <Text>{agendamento.paciente_nome}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={600}>Email do(a) Paciente:</Text>
                <Text>{agendamento.paciente_email}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={600}>Telefone do(a) Paciente:</Text>
                <Text>
                  {agendamento.paciente_numero_telefone
                    ? agendamento.paciente_numero_telefone
                    : 'Sem telefone'}
                </Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        <Card withBorder p="xl" radius="md">
          <Stack>
            <Title order={4}>Informações Gerais</Title>
            <Divider />
            <Grid>
              <Grid.Col span={4}>
                <Text fw={600}>Data:</Text>
                <Text>{formatarData(agendamento.data)}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={600}>Horário de Início:</Text>
                <Text>{formatarHora(agendamento.horario_inicio)}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={600}>Horário de Fim:</Text>
                <Text>{formatarHora(agendamento.horario_fim)}</Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text fw={600}>Tipo de Agendamento:</Text>
                <Text>{getTipoBadge(agendamento.tipo)}</Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <Text fw={600}>Estado:</Text>
                <Text>
                  {agendamento.estado
                    ? getEstadoBadge(agendamento.estado)
                    : 'Desconhecido'}
                </Text>
              </Grid.Col>
              {agendamento.estado === EstadoEnum.cancelado && (
                <Grid.Col span="auto">
                  <Text fw={600}>Motivo do Cancelamento:</Text>
                  <Text>
                    {agendamento.motivo_cancelamento
                      ? agendamento.motivo_cancelamento
                      : 'Não informado'}
                  </Text>
                </Grid.Col>
              )}
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </PageLayout>
  )
}
