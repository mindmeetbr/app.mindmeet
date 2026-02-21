import { createFileRoute } from '@tanstack/react-router'
import {
  Grid,
  Card,
  Text,
  // Title,
  Group,
  Stack,
  Badge,
  Avatar,
  Progress,
  SimpleGrid,
  rem,
  // Button
} from '@mantine/core'
import { FinancialValue } from '../../components/ui/FinancialValue'
import { PageLayout } from '../../components/layout'
import {
  IconCalendar,
  IconUsers,
  IconClock,
  IconTrendingUp,
  IconCalendarCheck,
  IconCalendarX,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { useAlterarTitle } from '../../hooks/useAlterarTitle'
// import { useProfileView } from '../../api/endpoints/api/api'

dayjs.locale('pt-br')

export const Route = createFileRoute('/app/')({
  component: Dashboard,
})

const mockData = {
  stats: {
    totalAgendamentos: 156,
    agendamentosHoje: 8,
    pacientesAtivos: 42,
    faturamentoMes: 15750,
  },
  proximosAgendamentos: [
    {
      id: 1,
      paciente: 'Maria Silva',
      avatar: null,
      horario: '09:00',
      data: dayjs().format('YYYY-MM-DD'),
      tipo: 'Consulta Individual',
      status: 'confirmado',
    },
    {
      id: 2,
      paciente: 'João Santos',
      avatar: null,
      horario: '10:30',
      data: dayjs().format('YYYY-MM-DD'),
      tipo: 'Terapia de Casal',
      status: 'pendente',
    },
    {
      id: 3,
      paciente: 'Ana Costa',
      avatar: null,
      horario: '14:00',
      data: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      tipo: 'Consulta Individual',
      status: 'confirmado',
    },
    {
      id: 4,
      paciente: 'Pedro Lima',
      avatar: null,
      horario: '15:30',
      data: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      tipo: 'Avaliação Psicológica',
      status: 'confirmado',
    },
  ],
  agendamentosRecentes: [
    {
      id: 1,
      paciente: 'Laura Oliveira',
      data: dayjs().subtract(1, 'day').format('DD/MM'),
      status: 'realizada',
    },
    {
      id: 2,
      paciente: 'Carlos Mendes',
      data: dayjs().subtract(2, 'day').format('DD/MM'),
      status: 'cancelada',
    },
    {
      id: 3,
      paciente: 'Julia Ferreira',
      data: dayjs().subtract(3, 'day').format('DD/MM'),
      status: 'realizada',
    },
  ],
}

function StatCard({ icon, title, value, description, color }: any) {
  return (
    <Card withBorder radius="md" p="xl">
      <Group justify="apart">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {title}
          </Text>
          <div>
            {typeof value === 'string' || typeof value === 'number' ? (
              <Text fw={700} fz="xl">
                {value}
              </Text>
            ) : (
              value
            )}
          </div>
          <Text c="dimmed" fz="sm">
            {description}
          </Text>
        </div>
        <div style={{ color }}>{icon}</div>
      </Group>
    </Card>
  )
}

function Dashboard() {
  useAlterarTitle('Dashboard')
  // const { data: user, isError } = useProfileView()
  const { stats, proximosAgendamentos, agendamentosRecentes } = mockData
  // const router = useRouter()

  // if (!user || isError) {
  //   router.navigate({to: '/login'})
  // }

  return (
    <PageLayout
      title="Dashboard"
      description="Visão geral das suas atividades e métricas"
    >
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard
          icon={<IconCalendar style={{ width: rem(24), height: rem(24) }} />}
          title="Total de Agendamentos"
          value={stats.totalAgendamentos}
          description="Este mês"
          color="var(--mantine-color-blue-6)"
        />
        <StatCard
          icon={<IconClock style={{ width: rem(24), height: rem(24) }} />}
          title="Agendamentos Hoje"
          value={stats.agendamentosHoje}
          description={`${dayjs().format('DD/MM/YYYY')}`}
          color="var(--mantine-color-green-6)"
        />
        <StatCard
          icon={<IconUsers style={{ width: rem(24), height: rem(24) }} />}
          title="Pacientes Ativos"
          value={stats.pacientesAtivos}
          description="Em acompanhamento"
          color="var(--mantine-color-orange-6)"
        />
        <StatCard
          icon={<IconTrendingUp style={{ width: rem(24), height: rem(24) }} />}
          title="Faturamento"
          value={
            <FinancialValue
              value={stats.faturamentoMes.toLocaleString('pt-BR')}
              prefix="R$ "
              showToggleButton={true}
            />
          }
          description="Este mês"
          color="var(--mantine-color-violet-6)"
        />
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" p="xl">
            <Group justify="apart" mb="md">
              <Text fw={600} size="lg">
                Próximos Agendamentos
              </Text>
              <Badge variant="light" color="blue">
                {proximosAgendamentos.length} agendamentos
              </Badge>
            </Group>

            <Stack gap="md">
              {proximosAgendamentos.map(agendamento => (
                <Group
                  key={agendamento.id}
                  justify="apart"
                  p="md"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: 'var(--mantine-color-gray-0)',
                  }}
                >
                  <Group>
                    <Avatar size="sm" />
                    <div>
                      <Text fw={500}>{agendamento.paciente}</Text>
                      <Text size="sm" c="dimmed">
                        {agendamento.tipo}
                      </Text>
                    </div>
                  </Group>

                  <div>
                    <Text size="sm" ta="right">
                      {dayjs(agendamento.data).format('DD/MM/YYYY')}
                    </Text>
                    <Text size="sm" ta="right" fw={500}>
                      {agendamento.horario}
                    </Text>
                  </div>

                  <Badge
                    variant="light"
                    color={
                      agendamento.status === 'confirmado' ? 'green' : 'orange'
                    }
                  >
                    {agendamento.status}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <Card withBorder radius="md" p="xl">
              <Group justify="apart" mb="md">
                <Text fw={600} size="lg">
                  Taxa de Ocupação
                </Text>
              </Group>

              <Stack gap="sm">
                <div>
                  <Group justify="apart" mb={5}>
                    <Text size="sm">Esta Semana</Text>
                    <Text size="sm" fw={500}>
                      85%
                    </Text>
                  </Group>
                  <Progress value={85} color="blue" size="sm" />
                </div>

                <div>
                  <Group justify="apart" mb={5}>
                    <Text size="sm">Próxima Semana</Text>
                    <Text size="sm" fw={500}>
                      92%
                    </Text>
                  </Group>
                  <Progress value={92} color="green" size="sm" />
                </div>
              </Stack>
            </Card>

            <Card withBorder radius="md" p="xl">
              <Group justify="apart" mb="md">
                <Text fw={600} size="lg">
                  Atividade Recente
                </Text>
              </Group>

              <Stack gap="sm">
                {agendamentosRecentes.map(item => (
                  <Group key={item.id} justify="apart">
                    <Group gap="xs">
                      {item.status === 'realizada' ? (
                        <IconCalendarCheck
                          style={{ width: rem(16), height: rem(16) }}
                          color="var(--mantine-color-green-6)"
                        />
                      ) : (
                        <IconCalendarX
                          style={{ width: rem(16), height: rem(16) }}
                          color="var(--mantine-color-red-6)"
                        />
                      )}
                      <div>
                        <Text size="sm">{item.paciente}</Text>
                        <Text size="xs" c="dimmed">
                          {item.data}
                        </Text>
                      </div>
                    </Group>
                    <Badge
                      size="xs"
                      variant="light"
                      color={item.status === 'realizada' ? 'green' : 'red'}
                    >
                      {item.status}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </PageLayout>
  )
}
