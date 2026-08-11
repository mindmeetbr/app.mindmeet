import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'

import {
  AgendamentoTipoEnum,
  EstadoEnum,
  type Agendamento,
} from '../../../api/models'
import { useForm } from '@mantine/form'
import { PageLayout, type BreadcrumbItem } from '../../../components/layout'
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react'
import {
  Button,
  Card,
  Grid,
  Group,
  rem,
  Select,
  Stack,
  Textarea,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { formatarHora, paraMaiuscula } from '../../../utils/agenda'
import { useMemo, useState, useEffect } from 'react'
import {
  useAgendamentoCreate,
  useAgendamentoDetail,
  useAgendamentoUpdate,
} from '../../../api/endpoints/agendamentos/agendamentos'
import { useAgendaDisponivel } from '../../../api/endpoints/disponibilidades/disponibilidades'
import useAuthStore from '../../../stores/auth-store'
import dayjs from 'dayjs'
import { usePacienteList } from '../../../api/endpoints/pacientes/pacientes'
import { notifications } from '@mantine/notifications'
import { useDebouncedValue } from '@mantine/hooks'
import type { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'

export const Route = createFileRoute('/app/agenda/novo')({
  component: AgendamentoCreatePage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
  }),
})

interface FormValues {
  paciente_id: string
  data: string
  horario_inicio: string
  horario_fim: string
  tipo: AgendamentoTipoEnum | ''
  estado: EstadoEnum
  motivo_cancelamento: string
}

interface ErroBackend {
  [campo: string]: string[]
}

const DEFAULT_VALUES: FormValues = {
  paciente_id: '',
  data: '',
  horario_inicio: '',
  horario_fim: '',
  tipo: '',
  estado: EstadoEnum.agendado,
  motivo_cancelamento: '',
}

const ESTADOS = [
  { label: paraMaiuscula(EstadoEnum.agendado), value: EstadoEnum.agendado },
  { label: paraMaiuscula(EstadoEnum.cancelado), value: EstadoEnum.cancelado },
  { label: paraMaiuscula(EstadoEnum.realizado), value: EstadoEnum.realizado },
]

const TIPOS = [
  {
    label: paraMaiuscula(AgendamentoTipoEnum.online),
    value: AgendamentoTipoEnum.online,
  },
  {
    label: paraMaiuscula(AgendamentoTipoEnum.presencial),
    value: AgendamentoTipoEnum.presencial,
  },
]

function agendamentoParaFormValues(agendamento: Agendamento): FormValues {
  return {
    paciente_id: agendamento.paciente.id,
    data: agendamento.data,
    horario_inicio: agendamento.horario_inicio,
    horario_fim: agendamento.horario_fim,
    tipo: agendamento.tipo as AgendamentoTipoEnum,
    estado: agendamento.estado as EstadoEnum,
    motivo_cancelamento: agendamento.motivo_cancelamento ?? '',
  }
}

function AgendamentoCreatePage() {
  const router = useRouter()
  const busca = useSearch({ from: '/app/agenda/novo' })
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const isEditing = !!busca.id
  const idAgendamento = busca.id

  const { mutate: criarAgendamento, isPending: criando } = useAgendamentoCreate(
    {
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
          queryClient.invalidateQueries({ queryKey: ['agendamentosFuturos'] })
        },
      },
    }
  )
  const { mutate: editarAgendamento, isPending: editando } =
    useAgendamentoUpdate({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
          queryClient.invalidateQueries({ queryKey: ['agendamentosFuturos'] })
        },
      },
    })
  const isSubmitting = criando || editando

  const { data: agendamento, isSuccess } = useAgendamentoDetail(
    idAgendamento ?? '',
    {
      query: { enabled: isEditing },
    }
  )

  const form = useForm<FormValues>({
    initialValues: DEFAULT_VALUES,
    validate: {
      paciente_id: value =>
        !value ? 'Um paciente deve ser selecionado' : null,
      data: value => (!value ? 'Data do agendamento é obrigatória' : null),
      horario_inicio: value =>
        !value ? 'Horário de início do agendamento é obrigatório' : null,
      horario_fim: value =>
        !value ? 'Horário de fim do agendamento é obrigatório' : null,
      tipo: value => (!value ? 'Tipo do agendamento é obrigatório' : null),
      estado: value => (!value ? 'Estado do agendamento é obrigatório' : null),
      motivo_cancelamento: (value, values) => {
        if (value && values.estado !== EstadoEnum.cancelado)
          return 'O motivo de cancelamento só é válido para agendamentos cancelados'
        return null
      },
    },
  })

  useEffect(() => {
    if (isEditing && isSuccess && agendamento) {
      form.setValues(agendamentoParaFormValues(agendamento))
      setHorarioSelecionado(
        `${agendamento.horario_inicio}|${agendamento.horario_fim}`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, agendamento])

  const [termoBusca, setTermoBusca] = useState('')
  const [termoBuscaDebounced] = useDebouncedValue(termoBusca, 300)

  const handleSearchChange = (valor: string) => {
    if (!form.values.paciente_id || valor === '') {
      setTermoBusca(valor)
    }
  }

  const handlePacienteChange = (valor: string | null) => {
    form.setFieldValue('paciente_id', valor ?? '')
    setTermoBusca('')
  }

  const { data: pacientes, isLoading: buscandoPacientes } = usePacienteList(
    { search: termoBuscaDebounced, tamanho: 20 },
    {
      query: {
        queryKey: ['pacientes-select', termoBuscaDebounced],
        enabled: termoBuscaDebounced.length >= 2,
        staleTime: 30 * 1000,
      },
    }
  )

  const opcoesPacientes = useMemo(() => {
    const lista =
      pacientes?.results?.map(p => ({
        value: p.id,
        label: `${p.nome_completo} — ${p.email}`,
      })) ?? []

    if (isEditing && agendamento?.paciente) {
      const jaEstaNaLista = lista.some(p => p.value === agendamento.paciente.id)
      if (!jaEstaNaLista) {
        lista.unshift({
          value: agendamento.paciente.id,
          label: `${agendamento.paciente.nome_completo} — ${agendamento.paciente.email}`,
        })
      }
    }

    return lista
  }, [pacientes, agendamento, isEditing])

  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const dataSelecionada = form.values.data

  const { data: agenda } = useAgendaDisponivel(
    user?.id as string,
    { data: dataSelecionada },
    {
      query: {
        enabled: !!dataSelecionada,
        staleTime: 5 * 60 * 1000,
        queryKey: ['agenda-dia', dataSelecionada],
      },
    }
  )

  const horariosDisponiveis = useMemo(() => {
    const horarios = agenda?.[0]?.horarios ?? []

    return horarios
      .filter(h => !h.ocupado || `${h.inicio}|${h.fim}` === horarioSelecionado)
      .map(h => ({
        value: `${h.inicio}|${h.fim}`,
        label: `${formatarHora(h.inicio)} - ${formatarHora(h.fim)}`,
      }))
  }, [agenda, horarioSelecionado])

  const handleHorarioChange = (valor: string | null) => {
    setHorarioSelecionado(valor ?? '')
    if (!valor) {
      form.setFieldValue('horario_inicio', '')
      form.setFieldValue('horario_fim', '')
      return
    }
    const [inicio, fim] = valor.split('|')
    form.setFieldValue('horario_inicio', inicio)
    form.setFieldValue('horario_fim', fim)
  }

  const handleDataChange = (valor: Date | null) => {
    form.setFieldValue('data', valor ? dayjs(valor).format('YYYY-MM-DD') : '')
    setHorarioSelecionado('')
    form.setFieldValue('horario_inicio', '')
    form.setFieldValue('horario_fim', '')
  }

  const tratarErroBackend = (error: AxiosError<ErroBackend>) => {
    const errosBackend = error?.response?.data
    if (errosBackend) {
      form.setErrors(
        Object.fromEntries(
          Object.entries(errosBackend).map(([campo, msgs]) => [campo, msgs[0]])
        )
      )
    }
    notifications.show({
      title: 'Erro ao salvar',
      message: 'Verifique os campos e tente novamente.',
      color: 'red',
    })
  }

  const handleSubmit = (values: FormValues) => {
    if (isEditing) {
      editarAgendamento(
        { id: idAgendamento!, data: values },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Agendamento atualizado',
              message: 'As alterações foram salvas com sucesso.',
              color: 'green',
            })
            router.navigate({
              to: '/app/agenda/$id',
              params: { id: idAgendamento! },
            })
          },
          onError: tratarErroBackend,
        }
      )
    } else {
      criarAgendamento(
        { data: values },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Agendamento criado',
              message: 'O agendamento foi adicionado com sucesso.',
              color: 'green',
            })
            router.navigate({ to: '/app/agenda' })
          },
          onError: tratarErroBackend,
        }
      )
    }
  }

  const voltarParaDetalhe = () =>
    router.navigate({ to: '/app/agenda/$id', params: { id: idAgendamento! } })

  const voltarParaLista = () => router.navigate({ to: '/app/agenda' })

  const breadcrumbs = useMemo(() => {
    const lista: BreadcrumbItem[] = [{ label: 'Agenda', href: '/app/agenda' }]

    if (isEditing && agendamento) {
      lista.push({
        label: agendamento.paciente.nome_completo,
        onClick: voltarParaDetalhe,
      })
    }

    lista.push({
      label: isEditing ? 'Editar' : 'Novo Agendamento',
      isCurrentPage: true,
    })

    return lista
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, agendamento])

  return (
    <PageLayout
      containerSize="lg"
      breadcrumbs={breadcrumbs}
      title={isEditing ? 'Editando Agendamento' : 'Novo Agendamento'}
      description={
        isEditing
          ? 'Atualize as informações do agendamento abaixo'
          : 'Preencha as informações para adicionar um novo agendamento'
      }
      secondaryAction={{
        label: 'Voltar',
        icon: <IconArrowLeft style={{ width: rem(16), height: rem(16) }} />,
        variant: 'subtle',
        onClick: isEditing ? voltarParaDetalhe : voltarParaLista,
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Dados do Paciente</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    label="Paciente"
                    description="Digite o nome ou email para buscar"
                    placeholder="Buscar paciente..."
                    searchable
                    data={opcoesPacientes}
                    onSearchChange={handleSearchChange}
                    value={form.values.paciente_id}
                    onChange={handlePacienteChange}
                    error={form.errors.paciente_id}
                    nothingFoundMessage={
                      termoBusca.length < 2
                        ? 'Digite pelo menos 2 caracteres'
                        : buscandoPacientes
                          ? 'Buscando...'
                          : 'Nenhum paciente encontrado'
                    }
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Informações do Agendamento</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <DatePickerInput
                    locale="pt-br"
                    valueFormat="DD/MM/YYYY"
                    label="Data"
                    description="Data do agendamento"
                    required
                    withAsterisk
                    value={
                      form.values.data ? dayjs(form.values.data).toDate() : null
                    }
                    onChange={handleDataChange}
                    error={form.errors.data}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    label="Horário"
                    description="Horários disponíveis para a data selecionada"
                    placeholder={
                      !dataSelecionada
                        ? 'Selecione uma data primeiro'
                        : horariosDisponiveis.length === 0
                          ? 'Nenhum horário disponível'
                          : 'Selecione um horário'
                    }
                    disabled={
                      !dataSelecionada || horariosDisponiveis.length === 0
                    }
                    data={horariosDisponiveis}
                    value={horarioSelecionado}
                    onChange={handleHorarioChange}
                    error={
                      form.errors.horario_inicio ?? form.errors.horario_fim
                    }
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    label="Tipo de Agendamento"
                    placeholder="Escolha um tipo"
                    description="Como será realizado o agendamento"
                    data={TIPOS}
                    required
                    withAsterisk
                    allowDeselect={false}
                    {...form.getInputProps('tipo')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Select
                    label="Estado do Agendamento"
                    placeholder="Escolha um estado"
                    description="Qual é a situação do agendamento"
                    data={ESTADOS}
                    required
                    withAsterisk
                    allowDeselect={false}
                    {...form.getInputProps('estado')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Textarea
                    disabled={form.values.estado !== EstadoEnum.cancelado}
                    label="Motivo do Cancelamento"
                    description="Descreva por quê o agendamento foi cancelado"
                    placeholder="..."
                    maxRows={2}
                    {...form.getInputProps('motivo_cancelamento')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          <Group justify="flex-end" gap="md">
            <Button
              variant="outline"
              onClick={isEditing ? voltarParaDetalhe : voltarParaLista}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              leftSection={
                <IconDeviceFloppy style={{ width: rem(16), height: rem(16) }} />
              }
              loading={isSubmitting}
            >
              {isEditing ? 'Salvar Alterações' : 'Adicionar Agendamento'}
            </Button>
          </Group>
        </Stack>
      </form>
    </PageLayout>
  )
}
