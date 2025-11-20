import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'

import type { Agendamento } from '../../../api/models'
import { AgendamentoTipoEnum, EstadoEnum } from '../../../api/models'
import { useForm } from '@mantine/form'
import { PageLayout } from '../../../components/layout'
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
  TextInput,
  Title,
} from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { paraMaiuscula } from '../../../utils/agenda'
import { useState } from 'react'

export const Route = createFileRoute('/app/agenda/novo')({
  component: AgendamentoCreatePage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
  }),
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

interface Breadcrumb {
  label: string
  href?: string
  onClick?: () => void
  isCurrentPage?: boolean
}

const estados = [
  { label: paraMaiuscula(EstadoEnum.agendado), value: EstadoEnum.agendado },
  { label: paraMaiuscula(EstadoEnum.cancelado), value: EstadoEnum.cancelado },
  { label: paraMaiuscula(EstadoEnum.realizado), value: EstadoEnum.realizado },
]

const tipos = [
  {
    label: paraMaiuscula(AgendamentoTipoEnum.online),
    value: AgendamentoTipoEnum.online,
  },
  {
    label: paraMaiuscula(AgendamentoTipoEnum.presencial),
    value: AgendamentoTipoEnum.presencial,
  },
]

function AgendamentoCreatePage() {
  const agendamento = mockAgendamento

  const router = useRouter()
  const busca = useSearch({ from: '/app/agenda/novo' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!busca.id
  const idAgendamento = busca.id

  const isSuccess = Math.random() > 0.5

  const getInitialValues = () => {
    const defaultValues = {
      paciente_nome: '',
      paciente_email: '',
      paciente_numero_telefone: '',
      data: '',
      horario_inicio: '',
      horario_fim: '',
      tipo: '',
      estado: '',
      motivo_cancelamento: '',
    }

    if (isEditing && idAgendamento && isSuccess && agendamento) {
      return agendamento
    }
    return defaultValues
  }

  const form = useForm({
    initialValues: getInitialValues(),
    validate: {
      paciente_nome: (value: string) =>
        !value ? 'Nome do paciente é obrigatório' : null,
      paciente_email: (value: string) =>
        !value
          ? 'Email é obrigatório'
          : /^\S+@\S+$/.test(value)
            ? null
            : 'Email inválido',
      data: (value: string) =>
        !value ? 'Data do agendamento é obrigatória' : null,
      horario_inicio: (value: string) =>
        !value ? 'Horário de ínicio do agendamento é obrigatório' : null,
      horario_fim: (value: string) =>
        !value ? 'Horário de fim do agendamento é obrigatório' : null,
      tipo: (value: string) =>
        !value ? 'Tipo do agendamento é obrigatório' : null,
      estado: (value: string) =>
        !value ? 'Tipo do agendamento é obrigatório' : null,
      motivo_cancelamento: (value: string, values) => {
        if (value && values.estado !== EstadoEnum.cancelado)
          return 'O motivo de cancelamento só é válido para agendamentos cancelados'
        return null
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    try {
      setIsSubmitting(true)
      if (isEditing) console.log('editando')
      else console.log('criando')

      console.log(JSON.stringify(values, null, 2))
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPacienteNome = () => {
    if (isEditing && idAgendamento && isSuccess && agendamento)
      return agendamento.paciente_nome
    return ''
  }

  const getBreadcrumbs = () => {
    const breadcrumbs: Breadcrumb[] = [{ label: 'Agenda', href: 'app/agenda' }]

    if (isEditing) {
      breadcrumbs.push({
        label: getPacienteNome(),
        onClick: () =>
          router.navigate({
            to: '/app/agenda/$id',
            params: { id: idAgendamento! },
          }),
      })
    }

    breadcrumbs.push({
      label: isEditing ? 'Editar' : 'Novo Agendamento',
      isCurrentPage: true,
    })
    return breadcrumbs
  }

  return (
    <PageLayout
      containerSize="lg"
      breadcrumbs={getBreadcrumbs()}
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
        onClick: () =>
          isEditing
            ? router.navigate({
                to: '/app/agenda/$id',
                params: { id: idAgendamento! },
              })
            : router.navigate({ to: '/app/agenda' }),
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Dados do Paciente</Title>
              <Grid>
                <Grid.Col span={4}>
                  <TextInput
                    label="Nome do Paciente"
                    placeholder="Digite o nome do paciente"
                    required
                    withAsterisk
                    {...form.getInputProps('paciente_nome')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Email do Paciente"
                    placeholder="Digite o email do paciente"
                    required
                    withAsterisk
                    {...form.getInputProps('paciente_nome')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Telefone do Paciente"
                    placeholder="Digite o número de telefone do paciente"
                    {...form.getInputProps('paciente_nome')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Informações do Agendamento</Title>
              <Grid>
                {/* Dados do Horário */}
                <Grid.Col span={4}>
                  <TextInput
                    label="Data"
                    description="Data do agendamento"
                    type="date"
                    required
                    withAsterisk
                    {...form.getInputProps('data')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TimeInput
                    label="Horário de Início"
                    description="Hora que o agendamento começa"
                    required
                    withAsterisk
                    {...form.getInputProps('horario_inicio')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TimeInput
                    label="Horário de Fim"
                    description="Hora que o agendamento termina"
                    required
                    withAsterisk
                    {...form.getInputProps('horario_fim')}
                  />
                </Grid.Col>
                {/* Outras informações */}
                <Grid.Col span={4}>
                  <Select
                    label="Tipo de Agendamento"
                    placeholder='Escolha um tipo'
                    description="Como será realizado o agendamento"
                    data={tipos}
                    required
                    withAsterisk
                  allowDeselect={false}
                    {...form.getInputProps('tipo')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Estado do Agendamento"
                    placeholder='Escolha um estado'
                    description={
                      form.values.estado !== EstadoEnum.agendado
                        ? 'Como foi realizada a consulta'
                        : 'Como será realizada a consulta'
                    }
                    data={estados}
                    required
                    withAsterisk
                  allowDeselect={false}
                    {...form.getInputProps('estado')}
                  />
                </Grid.Col>

                <Grid.Col span={4}>
                  <Textarea
                    disabled={form.values.estado !== EstadoEnum.cancelado}
                    label="Motivo do Cancelamento"
                    description="Descreva porquê o agendamento foi cancelado"
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
              onClick={() =>
                isEditing
                  ? router.navigate({
                      to: '/app/agenda/$id',
                      params: { id: idAgendamento! },
                    })
                  : router.navigate({ to: 'app/agenda' })
              }
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
