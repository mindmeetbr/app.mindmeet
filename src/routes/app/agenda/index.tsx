import {
  ActionIcon,
  Alert,
  Badge,
  Card,
  Center,
  Flex,
  Group,
  LoadingOverlay,
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
  IconAlertCircle,
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
import {
  AgendamentoTipoEnum,
  EstadoEnum,
  type Agendamento,
} from '../../../api/models'
import { useState } from 'react'
import {
  getEstadoBadge,
  getTipoBadge,
  formatarDataHora,
  paraMaiuscula,
} from '../../../utils/agenda'
import {
  useAgendamentoDelete,
  useAgendamentoList,
} from '../../../api/endpoints/agendamentos/agendamentos'

export const Route = createFileRoute('/app/agenda/')({
  component: PaginaAgendamentos,
})

interface AgendaProps {
  agendamentos: Agendamento[]
}

function TabelaAgendamentos({ agendamentos }: AgendaProps) {
  const [nomeBusca, setNomeBusca] = useState('')
  const [estadoBusca, setEstadoBusca] = useState('')
  const { mutate: apagarAgendamento } = useAgendamentoDelete()

  const estados = [
    { label: 'Todos', value: '' },
    { label: paraMaiuscula(EstadoEnum.agendado), value: EstadoEnum.agendado },
    { label: paraMaiuscula(EstadoEnum.cancelado), value: EstadoEnum.cancelado },
    { label: paraMaiuscula(EstadoEnum.realizado), value: EstadoEnum.realizado },
  ]

  const agendamentosFiltrados = agendamentos.filter(
    ag =>
      ag.paciente_nome.toLowerCase().includes(nomeBusca.toLowerCase()) &&
      ag.estado?.includes(estadoBusca.toLowerCase())
  )

  const handleDeleteClick = (idAgendamento: Agendamento['id']) => {
    const resposta = window.confirm(
      'Tem certeza que deseja apagar esse agendamento?'
    )
    if (resposta) apagarAgendamento({ idAgendamento })
  }

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
                    <Link to="/app/agenda/novo" search={{ id: agendamento.id }}>
                      <ActionIcon variant="light" color="orange" size="sm">
                        <IconEdit style={{ width: rem(14), height: rem(14) }} />
                      </ActionIcon>
                    </Link>
                    <ActionIcon
                      onClick={() => handleDeleteClick(agendamento.id)}
                      variant="light"
                      color="red"
                      size="sm"
                    >
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    </ActionIcon>
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

function AgendaFutura({ agendamentos }: AgendaProps) {
  const [horizonteBusca, setHorizonteBusca] = useState('7')

  const agora = new Date()

  const agendamentosFuturos = agendamentos
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
  const { data: agendamentos, isLoading, isError } = useAgendamentoList()
  const router = useRouter()

  if (isLoading) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Agenda', isCurrentPage: true },
        ]}
        title="Sua Agenda"
        description="Gerencie seus agendamentos e consultas"
      >
        <LoadingOverlay visible overlayProps={{ blur: 2 }} />
      </PageLayout>
    )
  }

  if (isError || agendamentos === undefined) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          { label: 'Agenda', isCurrentPage: true },
        ]}
        title="Sua Agenda"
        description="Gerencie seus agendamentos e consultas"
      >
        <Center mt="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Erro ao carregar dados"
            color="red"
            variant="filled"
          >
            Não foi possível carregar os agendamentos. Tente novamente mais
            tarde.
          </Alert>
        </Center>
      </PageLayout>
    )
  }

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
        onClick: () =>
          router.navigate({
            to: '/app/agenda/novo',
            search: { id: undefined },
          }),
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
          <TabelaAgendamentos agendamentos={agendamentos} />
        </Tabs.Panel>

        <Tabs.Panel value="agenda" pt="md">
          <AgendaFutura agendamentos={agendamentos} />
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  )
}
