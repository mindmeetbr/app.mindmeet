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
import { useEffect, useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import {
  useAdicionarHorariosView,
  useDisponibilidadeCreate,
  useDisponibilidadeList,
  useDisponibilidadeUpdate,
} from '../../api/endpoints/disponibilidades/disponibilidades'
import {
  AdicionarHorariosDiaEnum,
  DisponibilidadeDiaEnum,
  type Disponibilidade,
} from '../../api/models'
import { notifications } from '@mantine/notifications'

export const Route = createFileRoute('/app/disponibilidade')({
  component: CardDisponibilidades,
})

const diasSemana = [
  { value: '0', label: 'Segunda-feira' },
  { value: '1', label: 'Terça-feira' },
  { value: '2', label: 'Quarta-feira' },
  { value: '3', label: 'Quinta-feira' },
  { value: '4', label: 'Sexta-feira' },
  { value: '5', label: 'Sábado' },
  { value: '6', label: 'Domingo' },
]

function BotaoAdicionarHorarios() {
  const { mutate: adicionarHorarios } = useAdicionarHorariosView()
  const [opened, setOpened] = useState(false)
  const [formData, setFormData] = useState({
    dia: '',
    inicio: '',
    fim: '',
    duracao: '',
    intervalo: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const diaFormatado =
      AdicionarHorariosDiaEnum[
        `NUMBER_${formData.dia}` as keyof typeof AdicionarHorariosDiaEnum
      ]
    const dados = { ...formData, dia: diaFormatado }
    adicionarHorarios(
      { data: dados },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Sucesso!',
            message: 'Horários adicionados com sucesso.',
            color: 'green',
          })
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
    setOpened(false)
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
        onClose={() => setOpened(false)}
        title="Adicionar horários"
        centered
      >
        <Stack gap="sm">
          <Select
            label="Dia da semana"
            placeholder="Selecione o dia"
            data={diasSemana}
            value={formData.dia}
            onChange={value => handleChange('dia', value || '')}
            required
          />

          <TextInput
            type="time"
            label="Horário de início"
            description="Hora que os sessões disponíveis começarão"
            value={formData.inicio}
            onChange={e => handleChange('inicio', e.currentTarget.value)}
            required
          />

          <TextInput
            type="time"
            label="Horário de fim"
            description="Hora que os sessões disponíveis terminarão"
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
            description="Quantos horas deverá ter entre cada sessão"
            value={formData.intervalo}
            onChange={e => handleChange('intervalo', e.currentTarget.value)}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setOpened(false)}>
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
  const [carregando, setCarregando] = useState(false)
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>(
    []
  )
  const [idsDisponibilidades, setIds] = useState<string[]>([])
  const [idsHorarios, setIdsHorarios] = useState<(string | undefined)[]>([])
  const { mutate: salvarDisponibilidade } = useDisponibilidadeCreate()
  const { mutate: atualizarDisponibilidade } = useDisponibilidadeUpdate()

  const {
    data: listaDisponibilidades,
    isSuccess,
    isLoading,
  } = useDisponibilidadeList()

  useEffect(() => {
    if (isSuccess && listaDisponibilidades) {
      const disponibilidadesMap = new Map(
        listaDisponibilidades.map(d => [
          d.dia.toString(),
          {
            id: d.id,
            dia: DisponibilidadeDiaEnum[
              `NUMBER_${d.dia}` as keyof typeof DisponibilidadeDiaEnum
            ],
            dia_semana: d.dia_semana,
            ativo: d.ativo ?? false,
            horarios:
              d.horarios?.map(h => ({
                id: h.id,
                inicio: h.inicio,
                fim: h.fim,
                ocupado: h.ocupado ?? false,
              })) ?? [],
          },
        ])
      )

      const listaIds = []
      const listaIdsHorarios = []
      for (const disp of listaDisponibilidades) {
        listaIds.push(disp.id)
        if (disp.horarios) {
          for (const horario of disp.horarios) listaIdsHorarios.push(horario.id)
        }
      }
      setIds(listaIds)
      if (listaIdsHorarios) setIdsHorarios(listaIdsHorarios)

      const merged = diasSemana.map((dia, index) => {
        const existente = disponibilidadesMap.get(index.toString())
        return (
          existente || {
            id: crypto.randomUUID(),
            dia: DisponibilidadeDiaEnum[
              `NUMBER_${index}` as keyof typeof DisponibilidadeDiaEnum
            ],
            dia_semana: dia.label,
            ativo: false,
            horarios: [],
          }
        )
      })

      setDisponibilidades(merged)
    }
  }, [isSuccess, listaDisponibilidades, isLoading])

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
    setDisponibilidades(prev => {
      const clone = [...prev]
      clone[diaIndex] = {
        ...clone[diaIndex],
        horarios: [
          ...clone[diaIndex].horarios,
          {
            id: crypto.randomUUID(),
            inicio: '',
            fim: '',
          },
        ],
      }
      return clone
    })
  }

  const removerHorario = (diaIndex: number, horarioId: string) => {
    setDisponibilidades(prev => {
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
    campo: string,
    valor: string
  ) => {
    setDisponibilidades(prev => {
      const clone = [...prev]
      const dia = clone[diaIndex]

      clone[diaIndex] = {
        ...dia,
        horarios: dia.horarios?.map((h, i) =>
          i === horarioIndex ? { ...h, [campo]: valor } : h
        ),
      }

      return clone
    })
  }

  const alternarAtivo = (diaIndex: number, ativo: boolean) => {
    setDisponibilidades(prev => {
      const clone = [...prev]
      clone[diaIndex] = { ...clone[diaIndex], ativo }
      return clone
    })
  }

  const handleSave = () => {
    setCarregando(true)
    try {
      for (const disp of disponibilidades) {
        const { id, ...dados } = disp

        if (dados.horarios)
          dados.horarios = dados.horarios.map(horario => {
            if (idsHorarios?.includes(horario.id)) return horario
            const { id, ...novoHorario } = horario
            return novoHorario
          })

        if (idsDisponibilidades.includes(disp.id)) {
          atualizarDisponibilidade({ idDisp: id, data: dados })
        } else {
          salvarDisponibilidade({ data: dados })
        }
      }
      notifications.show({
        title: 'Sucesso!',
        message: 'Disponibilidades salvas com sucesso.',
        color: 'green',
      })
    } catch (error: unknown) {
      notifications.show({
        title: 'Erro',
        message:
          'Não foi possível salvar suas disponibilidades, tente novamente',
        color: 'red',
      })
      console.log((error as Error).message)
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
            {disponibilidades.map((dia, diaIndex) => (
              <Accordion.Item key={diaIndex} value={dia.dia.toString()}>
                <Accordion.Control>
                  <Group justify="space-between" align="center" w="100%">
                    <Group gap="md" align="center">
                      <Switch
                        checked={dia.ativo}
                        onChange={e =>
                          alternarAtivo(dia.dia, e.currentTarget.checked)
                        }
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
                        onClick={e => {
                          e.stopPropagation()
                          adicionarHorario(diaIndex)
                        }}
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
                      {dia.horarios?.map((horario, horarioIndex) => (
                        <Group key={horarioIndex} gap="sm" align="center">
                          <TextInput
                            type="time"
                            size="sm"
                            style={{ width: 100 }}
                            value={horario.inicio}
                            onChange={e =>
                              atualizarHorario(
                                dia.dia,
                                horarioIndex,
                                'inicio',
                                e.currentTarget.value
                              )
                            }
                          />
                          <Text size="sm" c="dimmed">
                            -
                          </Text>
                          <TextInput
                            type="time"
                            size="sm"
                            style={{ width: 100 }}
                            value={horario.fim}
                            onChange={e =>
                              atualizarHorario(
                                diaIndex,
                                horarioIndex,
                                'fim',
                                e.currentTarget.value
                              )
                            }
                          />
                          {dia.horarios?.length > 0 && (
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() =>
                                removerHorario(
                                  diaIndex,
                                  dia.horarios[horarioIndex].id
                                )
                              }
                              aria-label="Remover horário"
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          )}
                        </Group>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed" ta="center" py="md">
                      Dia desativado
                    </Text>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card>

        <BotaoAdicionarHorarios />
      </Flex>
    </PageLayout>
  )
}
