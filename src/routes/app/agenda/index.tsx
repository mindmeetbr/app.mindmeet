import {
  ActionIcon,
  Badge,
  Card,
  Flex,
  Group,
  rem,
  SegmentedControl,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Timeline,
} from '@mantine/core'
import {
  IconCalendarPlus,
  IconCalendarWeek,
  IconEdit,
  IconEye,
  IconListDetails,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import { AgendamentoTipoEnum, EstadoEnum } from '../../../api/models'
import { useState } from 'react'
import {
  getEstadoBadge,
  getTipoBadge,
  formatarDataHora,
  paraMaiuscula,
} from '../../../utils/agenda'

export const Route = createFileRoute('/app/agenda/')({
  component: PaginaAgendamentos,
})

const mockAgendamentos = [
  {
    id: crypto.randomUUID(),
    data: '2025-11-08',
    tipo: 'online',
    horario_inicio: '10:00:00.000Z',
    horario_fim: '11:00:00.000Z',
    paciente_nome: 'Ana Silva',
    paciente_email: 'ana.silva@exemplo.com',
    paciente_numero_telefone: '(84) 91234-5678',
    estado: 'agendado',
    motivo_cancelamento: '',
  },
  {
    id: crypto.randomUUID(),
    data: '2025-11-07',
    tipo: 'presencial',
    horario_inicio: '14:30:00.000Z',
    horario_fim: '15:30:00.000Z',
    paciente_nome: 'Carlos Oliveira',
    paciente_email: 'carlos.oliver@exemplo.com',
    paciente_numero_telefone: '(84) 98765-4321',
    estado: 'realizado',
    motivo_cancelamento: '',
  },
  {
    id: crypto.randomUUID(),
    data: '2025-11-10',
    tipo: 'online',
    horario_inicio: '09:00:00.000Z',
    horario_fim: '09:45:00.000Z',
    paciente_nome: 'Beatriz Souza',
    paciente_email: 'beatriz.souza@exemplo.com',
    paciente_numero_telefone: '(85) 93456-7890',
    estado: 'cancelado',
    motivo_cancelamento: 'Emergência pessoal',
  },
  {
    id: crypto.randomUUID(),
    data: '2025-11-06',
    tipo: 'presencial',
    horario_inicio: '16:00:00.000Z',
    horario_fim: '17:00:00.000Z',
    paciente_nome: 'Daniel Costa',
    paciente_email: 'daniel.costa@exemplo.com',
    paciente_numero_telefone: '(11) 98765-1234',
    estado: 'agendado',
    motivo_cancelamento: '',
  },
  {
    id: crypto.randomUUID(),
    data: '2025-12-05',
    tipo: 'online',
    horario_inicio: '11:30:00.000Z',
    horario_fim: '12:00:00.000Z',
    paciente_nome: 'Eliane Ferreira',
    paciente_email: 'eliane.ferreira@exemplo.com',
    paciente_numero_telefone: '(21) 99876-5432',
    estado: 'agendado',
    motivo_cancelamento: '',
  },
  {
    id: crypto.randomUUID(),
    data: '2025-11-18',
    tipo: 'online',
    horario_inicio: '09:00:00.000Z',
    horario_fim: '09:45:00.000Z',
    paciente_nome: 'Beatriz Souza',
    paciente_email: 'beatriz.souza@exemplo.com',
    paciente_numero_telefone: '(85) 93456-7890',
    estado: 'agendado',
    motivo_cancelamento: '',
  },
  {
    id: crypto.randomUUID(),
    data: '2025-12-07',
    tipo: 'presencial',
    horario_inicio: '14:30:00.000Z',
    horario_fim: '15:30:00.000Z',
    paciente_nome: 'Carlos Oliveira',
    paciente_email: 'carlos.oliver@exemplo.com',
    paciente_numero_telefone: '(84) 98765-4321',
    estado: 'agendado',
    motivo_cancelamento: '',
  },
]

function TabelaAgendamentos() {
  const [nomeBusca, setNomeBusca] = useState('')
  const [estadoBusca, setEstadoBusca] = useState('')

  const estados = [
    { label: 'Todos', value: '' },
    { label: paraMaiuscula(EstadoEnum.agendado), value: EstadoEnum.agendado },
    { label: paraMaiuscula(EstadoEnum.cancelado), value: EstadoEnum.cancelado },
    { label: paraMaiuscula(EstadoEnum.realizado), value: EstadoEnum.realizado },
  ]

  const agendamentosFiltrados = mockAgendamentos.filter(
    ag =>
      ag.paciente_nome.toLowerCase().includes(nomeBusca.toLowerCase()) &&
      ag.estado.includes(estadoBusca.toLowerCase())
  )

  return (
    <Card withBorder radius="md" p="md">
      <Group mb="md">
        <TextInput
          placeholder="Buscar por nome do paciente ou email..."
          leftSection={
            <IconSearch style={{ width: rem(16), height: rem(16) }} />
          }
          value={nomeBusca}
          onChange={e => setNomeBusca(e.target.value)}
          style={{ flex: 1 }}
        />
        <SegmentedControl
          defaultValue={estadoBusca}
          value={estadoBusca}
          onChange={setEstadoBusca}
          data={estados}
        />
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Paciente</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Data</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {agendamentosFiltrados.map(agendamento => (
              <Table.Tr key={agendamento.id}>
                <Table.Td>
                  <Stack gap={0}>
                    <Text fw={500}>{agendamento.paciente_nome}</Text>
                    <Text size="xs" c="dimmed">
                      {agendamento.paciente_email}
                    </Text>
                  </Stack>
                </Table.Td>
                {/* isso não existe bicho */}
                <Table.Td>
                  {getTipoBadge(
                    AgendamentoTipoEnum[
                      agendamento.tipo as keyof typeof AgendamentoTipoEnum
                    ]
                  )}
                </Table.Td>
                <Table.Td>
                  <Stack gap={0}>
                    <Text>
                      {formatarDataHora(
                        agendamento.data,
                        agendamento.horario_inicio
                      )}
                    </Text>
                  </Stack>
                </Table.Td>

                <Table.Td>
                  {getEstadoBadge(
                    EstadoEnum[agendamento.estado as keyof typeof EstadoEnum]
                  )}
                </Table.Td>
                <Table.Td>
                  <Flex gap="xs">
                    <Link to="/app/agenda/$id" params={{ id: agendamento.id }}>
                      <ActionIcon variant="light" color="blue" size="sm">
                        <IconEye style={{ width: rem(14), height: rem(14) }} />
                      </ActionIcon>
                    </Link>
                    <Link to="/" disabled>
                      <ActionIcon variant="light" color="orange" size="sm">
                        <IconEdit style={{ width: rem(14), height: rem(14) }} />
                      </ActionIcon>
                    </Link>
                    <Link to="/" disabled>
                      <ActionIcon variant="light" color="red" size="sm">
                        <IconTrash
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      </ActionIcon>
                    </Link>
                  </Flex>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  )
}
function AgendaFutura() {
  const [horizonteBusca, setHorizonteBusca] = useState('7') // Padrão: 7 dias

  const agora = new Date()

  const agendamentosFuturos = mockAgendamentos
    .filter(ag => {
      const horaInicio = new Date(`${ag.data}T${ag.horario_inicio}`)
      return horaInicio >= agora && ag.estado === 'agendado'
    })
    .filter(ag => {
      if (horizonteBusca === 'todos') {
        return true
      }

      const limiteDias = Number.parseInt(horizonteBusca)
      const limiteData = new Date()
      limiteData.setDate(agora.getDate() + limiteDias)

      const horaInicio = new Date(`${ag.data}T${ag.horario_inicio}`)
      return horaInicio <= limiteData
    })
    .sort(
      (a, b) =>
        new Date(`${a.data}T${a.horario_inicio}`) -
        new Date(`${b.data}T${b.horario_fim}`)
    )

  const horizonteOpcoes = [
    { label: 'Próximos 7 Dias', value: '7' },
    { label: 'Próximos 30 Dias', value: '30' },
    { label: 'Tudo (Futuro)', value: 'todos' },
  ]

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            Próximos Agendamentos
          </Text>
          <SegmentedControl
            value={horizonteBusca}
            onChange={setHorizonteBusca}
            data={horizonteOpcoes}
          />
        </Group>

        {agendamentosFuturos.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Nenhum agendamento futuro encontrado neste período.
          </Text>
        ) : (
          <Timeline
            active={agendamentosFuturos.length}
            bulletSize={24}
            lineWidth={2}
          >
            {agendamentosFuturos.map(agendamento => (
              <Timeline.Item
                key={agendamento.id}
                title={<Text fw={500}>{agendamento.paciente_nome}</Text>}
                bullet={getTipoBadge(
                  AgendamentoTipoEnum[
                    agendamento.tipo as keyof typeof AgendamentoTipoEnum
                  ]
                )}
                lineVariant="solid"
              >
                <Stack gap={2}>
                  <Text size="sm" c="dimmed">
                    {formatarDataHora(
                      agendamento.data,
                      agendamento.horario_inicio
                    )}
                  </Text>
                  <Group gap="xs">
                    <Badge
                      color={
                        agendamento.tipo === 'online' ? 'violet' : 'orange'
                      }
                      size="sm"
                      variant="light"
                    >
                      {paraMaiuscula(agendamento.tipo)}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {agendamento.paciente_numero_telefone}
                    </Text>
                  </Group>
                </Stack>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Stack>
    </Card>
  )
}

function PaginaAgendamentos() {
  const router = useRouter()

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Agenda', isCurrentPage: true },
      ]}
      title="Sua Agenda"
      description="Gerencie seus agendamentos e consultas"
      primaryAction={{
        label: 'Adicionar',
        icon: <IconCalendarPlus style={{ width: rem(16), height: rem(16) }} />,
        variant: 'light',
        onClick: () => router.navigate({ to: '/app/agenda/novo' }),
      }}
    >
      <Tabs defaultValue="agendamentos">
        <Tabs.List>
          <Tabs.Tab
            leftSection={<IconListDetails size={18} />}
            value="agendamentos"
          >
            Agendamentos
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconCalendarWeek size={18} />} value="agenda">
            Agenda
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="agendamentos" pt="md">
          <TabelaAgendamentos />
        </Tabs.Panel>

        <Tabs.Panel value="agenda" pt="md">
          <AgendaFutura />
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  )
}
