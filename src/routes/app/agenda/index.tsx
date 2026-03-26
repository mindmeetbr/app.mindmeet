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
  Timeline,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconCalendarPlus,
  IconCalendarWeek,
  IconCheck,
  IconEdit,
  IconEye,
  IconListDetails,
  IconTrash,
} from '@tabler/icons-react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { PageLayout } from '../../../components/layout'
import {
  type AgendamentoListEstado,
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
  useAgendamentoUpdate,
  useAgendaPessoal,
} from '../../../api/endpoints/agendamentos/agendamentos'
import { usePaginacao } from '../../../hooks/usePaginacao'
import { TabelaPaginada } from '../../../components/ui/TabelaPaginada'
import { useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'

export const Route = createFileRoute('/app/agenda/')({
  component: PaginaAgendamentos,
})

function TabelaAgendamentos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const { mutate: apagarAgendamento } = useAgendamentoDelete()
  const queryClient = useQueryClient()
  const { mutate: concluirAgendamento, isPending } = useAgendamentoUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
        notifications.show({ title: 'Sucesso', message: 'Consulta finalizada' })
      },
      onError: () => {},
    },
  })

  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao()
  const { data, isLoading, isError, refetch } = useAgendamentoList(
    {
      pagina,
      tamanho,
      estado: (estadoFiltro as keyof typeof AgendamentoListEstado) || undefined,
    },
    { query: { queryKey: ['agendamentos', pagina, tamanho, estadoFiltro] } }
  )

  const estados = [
    { label: 'Todos', value: '' },
    { label: paraMaiuscula(EstadoEnum.agendado), value: EstadoEnum.agendado },
    { label: paraMaiuscula(EstadoEnum.cancelado), value: EstadoEnum.cancelado },
    { label: paraMaiuscula(EstadoEnum.realizado), value: EstadoEnum.realizado },
  ]

  const listaAgendamentos = data?.results ?? []
  const agendamentosFiltrados = listaAgendamentos.filter(
    ag =>
      ag.paciente.nome_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ag.paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleConcluir = (id: string) => {
    concluirAgendamento({
      id,
      data: { estado: EstadoEnum.realizado },
    })
  }

  const handleDeleteClick = (id: Agendamento['id']) => {
    const resposta = window.confirm(
      'Tem certeza que deseja apagar esse agendamento?'
    )
    if (resposta) apagarAgendamento({ id })
  }

  const renderLinhaAgendamento = (agendamento: Agendamento) => (
    <Table.Tr key={agendamento.id}>
      <Table.Td>
        <Stack gap={0}>
          <Text fw={500}>{agendamento.paciente.nome_completo}</Text>
          <Text size="xs" c="dimmed">
            {agendamento.paciente.email}
          </Text>
        </Stack>
      </Table.Td>
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
            {formatarDataHora(agendamento.data, agendamento.horario_inicio)}
          </Text>
        </Stack>
      </Table.Td>

      <Table.Td>
        {getEstadoBadge(
          EstadoEnum[agendamento.estado as keyof typeof EstadoEnum]
        )}
      </Table.Td>
      {/* ações com o agendamento */}
      <Table.Td>
        <Flex gap="xs">
          {agendamento.estado === EstadoEnum.agendado && (
            <ActionIcon
              variant="light"
              color="green"
              size="sm"
              title="Marcar como realizado"
              onClick={() => handleConcluir(agendamento.id)}
              loading={isPending}
            >
              <IconCheck style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          )}
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
  )

  const COLUNAS_AGENDAMENTOS = [
    { chave: 'paciente', label: 'Paciente' },
    { chave: 'tipo', label: 'Tipo' },
    { chave: 'data', label: 'Data' },
    { chave: 'estado', label: 'Estado' },
    { chave: 'ações', label: 'Ações', largura: 160 },
  ]

  const handleEstadoChange = (valor: string) => {
    setEstadoFiltro(valor)
    setPagina(1)
  }

  return (
    <TabelaPaginada
      dados={agendamentosFiltrados}
      total={data?.count ?? 0}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      colunas={COLUNAS_AGENDAMENTOS}
      renderLinha={renderLinhaAgendamento}
      pagina={pagina}
      tamanho={tamanho}
      onPaginaChange={setPagina}
      onTamanhoChange={setTamanho}
      termoBusca={searchTerm}
      onBuscaChange={setSearchTerm}
      placeholderBusca="Buscar por nome do paciente ou email..."
      mensagemVazia="Nenhum agendamento encontrado."
      mensagemErro="Não foi possível carregar seus agendamentos. Tente novamente."
      acoes={
        <SegmentedControl
          defaultValue={estadoFiltro}
          value={estadoFiltro}
          onChange={handleEstadoChange}
          data={estados}
        />
      }
    />
  )
}

function AgendaFutura() {
  const limparHorizonte = (h: string | undefined) => {
    const dias = Number(h)
    if (Number.isNaN(dias)) return undefined
    return dias
  }

  const [horizonteBusca, setHorizonteBusca] = useState<string>('7')
  const { data } = useAgendaPessoal(
    { dias: limparHorizonte(horizonteBusca) },
    {
      query: {
        queryKey: ['agendamentosFuturos', horizonteBusca],
        staleTime: 1000 * 60 * 5,
        placeholderData: previousData => previousData,
      },
    }
  )
  const agendamentos = data ?? []

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
    .sort((a, b) => {
      const dataA = new Date(`${a.data}T${a.horario_inicio}`)
      const dataB = new Date(`${b.data}T${b.horario_fim}`)
      return dataA - dataB
    })

  const horizonteOpcoes: { label: string; value: string }[] = [
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
                title={
                  <Text fw={500}>{agendamento.paciente.nome_completo}</Text>
                }
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
                      {agendamento.paciente.numero_telefone}
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
          <TabelaAgendamentos />
        </Tabs.Panel>

        <Tabs.Panel value="agenda" pt="md">
          <AgendaFutura />
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  )
}
