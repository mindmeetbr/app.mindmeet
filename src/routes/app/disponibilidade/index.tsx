import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  Stack,
  Group,
  Switch,
  Text,
  TextInput,
  ActionIcon,
  LoadingOverlay,
  Accordion,
  Button,
  Modal,
  Select,
  Flex,
} from '@mantine/core'
import { IconClockPlus, IconPlus, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { PageLayout } from '../../../components/layout/PageLayout'
import {
  useAdicionarHorarios,
  useDisponibilidadeCreate,
  useDisponibilidadeUpdate,
} from '../../../api/endpoints/disponibilidades/disponibilidades'
import { AdicionarHorariosDiaEnum, PapelEnum } from '../../../api/models'
import { notifications } from '@mantine/notifications'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import type { DisponibilidadeLocal, HorarioLocal } from './-types'
import {
  diasSemana,
  salvarDisponibilidades,
  useDisponibilidadesMerged,
} from './-useDisponibilidade'
import { exigirPapel } from '../../../utils/auth'

export const Route = createFileRoute('/app/disponibilidade/')({
  beforeLoad: exigirPapel(PapelEnum.PSICOLOGO),
  component: CardDisponibilidades,
})

interface FormAdicionarHorarios {
  dia: string
  inicio: string
  fim: string
  duracao: string
  intervalo: string
}

const formInicial: FormAdicionarHorarios = {
  dia: '',
  inicio: '',
  fim: '',
  duracao: '',
  intervalo: '',
}

function BotaoAdicionarHorarios() {
  const { mutate: adicionarHorarios } = useAdicionarHorarios()
  const [opened, setOpened] = useState(false)
  const [formData, setFormData] = useState<FormAdicionarHorarios>(formInicial)

  const handleChange = (field: keyof FormAdicionarHorarios, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFechar = () => {
    setOpened(false)
    setFormData(formInicial)
  }

  const handleSubmit = () => {
    const diaFormatado =
      AdicionarHorariosDiaEnum[
        `NUMBER_${formData.dia}` as keyof typeof AdicionarHorariosDiaEnum
      ]

    adicionarHorarios(
      { data: { ...formData, dia: diaFormatado } },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Sucesso!',
            message: 'Horários adicionados com sucesso.',
            color: 'green',
          })
          handleFechar()
        },
        onError: () => {
          notifications.show({
            title: 'Erro',
            message: 'Não foi possível adicionar os horários, tente novamente.',
            color: 'red',
          })
        },
      }
    )
  }

  return (
    <>
      <Group>
        <Button
          leftSection={<IconClockPlus size={16} />}
          onClick={() => setOpened(true)}
        >
          Adicionar horário
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={handleFechar}
        title="Adicionar horários"
        centered
      >
        <Stack gap="sm">
          <Select
            label="Dia da semana"
            placeholder="Selecione o dia"
            data={diasSemana}
            value={formData.dia}
            onChange={value => handleChange('dia', value ?? '')}
            required
          />
          <TextInput
            type="time"
            label="Horário de início"
            description="Hora que as sessões disponíveis começarão"
            value={formData.inicio}
            onChange={e => handleChange('inicio', e.currentTarget.value)}
            required
          />
          <TextInput
            type="time"
            label="Horário de fim"
            description="Hora que as sessões disponíveis terminarão"
            value={formData.fim}
            onChange={e => handleChange('fim', e.currentTarget.value)}
            required
          />
          <TextInput
            type="time"
            label="Duração"
            description="Quantas horas cada sessão deverá ter"
            value={formData.duracao}
            onChange={e => handleChange('duracao', e.currentTarget.value)}
            required
          />
          <TextInput
            type="time"
            label="Intervalo"
            description="Quantas horas deverá ter entre cada sessão"
            value={formData.intervalo}
            onChange={e => handleChange('intervalo', e.currentTarget.value)}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={handleFechar}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}

function CardDisponibilidades() {
  useAlterarTitle('Disponibilidade')

  const [carregando, setCarregando] = useState(false)
  const { mutate: salvarDisponibilidade } = useDisponibilidadeCreate()
  const { mutate: atualizarDisponibilidade } = useDisponibilidadeUpdate()

  const { disponibilidades, idsDisponibilidades, idsHorarios, isLoading } =
    useDisponibilidadesMerged()

  const [disponibilidadesLocais, setDisponibilidadesLocais] = useState<
    DisponibilidadeLocal[]
  >([])

  const [inicializado, setInicializado] = useState(false)
  if (!inicializado && disponibilidades.length > 0) {
    setDisponibilidadesLocais(disponibilidades)
    setInicializado(true)
  }

  if (isLoading) {
    return (
      <PageLayout
        title="Disponibilidade"
        description="Configure sua disponibilidade semanal para atendimentos"
      >
        <Flex align="center" justify="center" w="100%" h="100%">
          <LoadingOverlay visible />
        </Flex>
      </PageLayout>
    )
  }

  const adicionarHorario = (diaIndex: number) => {
    setDisponibilidadesLocais(prev => {
      const clone = [...prev]
      const novoHorario: HorarioLocal = {
        id: crypto.randomUUID(),
        inicio: '',
        fim: '',
      }
      clone[diaIndex] = {
        ...clone[diaIndex],
        horarios: [...clone[diaIndex].horarios, novoHorario],
      }
      return clone
    })
  }

  const removerHorario = (diaIndex: number, horarioId: string) => {
    setDisponibilidadesLocais(prev => {
      const clone = [...prev]
      clone[diaIndex] = {
        ...clone[diaIndex],
        horarios: clone[diaIndex].horarios.filter(h => h.id !== horarioId),
      }
      return clone
    })
  }

  const atualizarHorario = (
    diaIndex: number,
    horarioIndex: number,
    campo: keyof Pick<HorarioLocal, 'inicio' | 'fim'>,
    valor: string
  ) => {
    setDisponibilidadesLocais(prev => {
      const clone = [...prev]
      clone[diaIndex] = {
        ...clone[diaIndex],
        horarios: clone[diaIndex].horarios.map((horario, index) =>
          index === horarioIndex ? { ...horario, [campo]: valor } : horario
        ),
      }
      return clone
    })
  }

  const alternarAtivo = (diaIndex: number, ativo: boolean) => {
    setDisponibilidadesLocais(prev => {
      const clone = [...prev]
      clone[diaIndex] = { ...clone[diaIndex], ativo }
      return clone
    })
  }

  const handleSave = () => {
    setCarregando(true)
    try {
      salvarDisponibilidades({
        disponibilidades: disponibilidadesLocais,
        idsDisponibilidades,
        idsHorarios,
        salvarDisponibilidade,
        atualizarDisponibilidade,
      })
      notifications.show({
        title: 'Sucesso!',
        message: 'Disponibilidades salvas com sucesso.',
        color: 'green',
      })
    } catch (error: unknown) {
      notifications.show({
        title: 'Erro',
        message:
          'Não foi possível salvar suas disponibilidades, tente novamente.',
        color: 'red',
      })
      console.error((error as Error).message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <PageLayout
      title="Disponibilidade"
      description="Configure sua disponibilidade semanal para atendimentos"
      primaryAction={{
        label: 'Salvar',
        onClick: handleSave,
        loading: carregando,
      }}
    >
      <Flex align="flex-start" justify="space-between" gap="lg" w="100%">
        <Card withBorder p="xl" miw={600} style={{ maxWidth: 600 }}>
          <LoadingOverlay visible={isLoading} />
          <Accordion variant="contained" multiple>
            {disponibilidadesLocais.map((dia, diaIndex) => {
              const handleAlternarAtivo = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => alternarAtivo(diaIndex, e.currentTarget.checked)
              const handleAdicionarHorario = (
                e: React.MouseEvent<HTMLButtonElement>
              ) => {
                e.stopPropagation()
                adicionarHorario(diaIndex)
              }

              return (
                <Accordion.Item key={dia.id} value={dia.dia.toString()}>
                  <Accordion.Control>
                    <Group justify="space-between" align="center" w="100%">
                      <Group gap="md" align="center">
                        <Switch
                          checked={dia.ativo}
                          onChange={handleAlternarAtivo}
                          size="md"
                          onClick={e => e.stopPropagation()}
                        />
                        <Text fw={500} size="sm">
                          {dia.dia_semana}
                        </Text>
                      </Group>

                      {dia.ativo && (
                        <ActionIcon
                          variant="filled"
                          color="blue"
                          size="sm"
                          onClick={handleAdicionarHorario}
                          aria-label="Adicionar horário"
                        >
                          <IconPlus size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  </Accordion.Control>

                  <Accordion.Panel>
                    {dia.ativo ? (
                      <Stack gap="sm" mt="md">
                        {dia.horarios.map((horario, horarioIndex) => {
                          const handleInicioChange = (
                            e: React.ChangeEvent<HTMLInputElement>
                          ) =>
                            atualizarHorario(
                              diaIndex,
                              horarioIndex,
                              'inicio',
                              e.currentTarget.value
                            )

                          const handleFimChange = (
                            e: React.ChangeEvent<HTMLInputElement>
                          ) =>
                            atualizarHorario(
                              diaIndex,
                              horarioIndex,
                              'fim',
                              e.currentTarget.value
                            )

                          const handleRemover = () =>
                            removerHorario(diaIndex, horario.id)

                          return (
                            <Group key={horario.id} gap="sm" align="center">
                              <TextInput
                                type="time"
                                size="sm"
                                style={{ width: 100 }}
                                value={horario.inicio}
                                onChange={handleInicioChange}
                              />
                              <Text size="sm" c="dimmed">
                                -
                              </Text>
                              <TextInput
                                type="time"
                                size="sm"
                                style={{ width: 100 }}
                                value={horario.fim}
                                onChange={handleFimChange}
                              />
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                size="sm"
                                onClick={handleRemover}
                                aria-label="Remover horário"
                              >
                                <IconX size={16} />
                              </ActionIcon>
                            </Group>
                          )
                        })}
                      </Stack>
                    ) : (
                      <Text size="sm" c="dimmed" ta="center" py="md">
                        Dia desativado
                      </Text>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        </Card>

        <BotaoAdicionarHorarios />
      </Flex>
    </PageLayout>
  )
}
