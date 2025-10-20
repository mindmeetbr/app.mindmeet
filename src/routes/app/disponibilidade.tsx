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
import { PageLayout } from '../../components/layout/PageLayout'

export const Route = createFileRoute('/app/disponibilidade')({
  component: RouteComponent,
})

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

interface DayAvailability {
  enabled: boolean
  timeSlots: TimeSlot[]
}

interface AvailabilityData {
  [key: string]: DayAvailability
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

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
    console.log(JSON.stringify(formData, null, 2))
    // TODO: integrar com a api
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
            value={formData.inicio}
            onChange={e => handleChange('inicio', e.currentTarget.value)}
            required
          />

          <TextInput
            type="time"
            label="Horário de fim"
            value={formData.fim}
            onChange={e => handleChange('fim', e.currentTarget.value)}
            required
          />

          <TextInput
            type="time"
            label="Duração"
            value={formData.duracao}
            onChange={e => handleChange('duracao', e.currentTarget.value)}
            required
          />

          <TextInput
            type="time"
            label="Intervalo"
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

function RouteComponent() {
  const [availability, setAvailability] = useState<AvailabilityData>(() => {
    const initial: AvailabilityData = {}
    DAYS_OF_WEEK.forEach(day => {
      initial[day.key] = {
        enabled: false,
        timeSlots: [
          {
            id: `${day.key}-1`,
            startTime: '00:00',
            endTime: '00:00',
          },
        ],
      }
    })
    return initial
  })

  const [loading, setLoading] = useState(false)
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleDay = (dayKey: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
      },
    }))
  }

  const addTimeSlot = (dayKey: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: [
          ...prev[dayKey].timeSlots,
          {
            id: `${dayKey}-${Date.now()}`,
            startTime: '00:00',
            endTime: '00:00',
          },
        ],
      },
    }))
  }

  const removeTimeSlot = (dayKey: string, slotId: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.filter(slot => slot.id !== slotId),
      },
    }))
  }

  const updateTimeSlot = (
    dayKey: string,
    slotId: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setAvailability(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.map(slot =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        ),
      },
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Implement API call to save availability
      console.log('Saving availability:', availability)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // TODO: Show success notification
      console.log('Availability saved successfully')
    } catch (error) {
      // TODO: Show error notification
      console.error('Error saving availability:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout
      title="Disponibilidade"
      description="Configure sua disponibilidade semanal para atendimentos"
      primaryAction={{
        label: 'Salvar',
        onClick: handleSave,
        loading: loading,
      }}
    >
      <Flex align="flex-start" justify="space-between" gap="lg" w="100%">
        <Card withBorder p="xl" miw={600} style={{ maxWidth: 600 }}>
          <LoadingOverlay visible={loading} />
          <Accordion
            variant="contained"
            value={openItems}
            onChange={setOpenItems}
            multiple
          >
            {DAYS_OF_WEEK.map((day, index) => (
              <Accordion.Item key={day.key} value={day.key}>
                <Accordion.Control>
                  <Group justify="space-between" align="center" w="100%">
                    <Group gap="md" align="center">
                      <Switch
                        checked={availability[day.key].enabled}
                        onChange={() => toggleDay(day.key)}
                        size="md"
                        onClick={e => e.stopPropagation()}
                      />
                      <Text fw={500} size="sm">
                        {day.label}
                      </Text>
                    </Group>

                    {availability[day.key].enabled && (
                      <ActionIcon
                        variant="filled"
                        color="blue"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation()
                          addTimeSlot(day.key)
                        }}
                        aria-label="Adicionar horário"
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                </Accordion.Control>

                <Accordion.Panel>
                  {availability[day.key].enabled ? (
                    <Stack gap="sm" mt="md">
                      {availability[day.key].timeSlots.map(
                        (slot, slotIndex) => (
                          <Group key={slot.id} gap="sm" align="center">
                            <TextInput
                              type="time"
                              value={slot.startTime}
                              onChange={e =>
                                updateTimeSlot(
                                  day.key,
                                  slot.id,
                                  'startTime',
                                  e.target.value
                                )
                              }
                              size="sm"
                              style={{ width: 100 }}
                            />
                            <Text size="sm" c="dimmed">
                              -
                            </Text>
                            <TextInput
                              type="time"
                              value={slot.endTime}
                              onChange={e =>
                                updateTimeSlot(
                                  day.key,
                                  slot.id,
                                  'endTime',
                                  e.target.value
                                )
                              }
                              size="sm"
                              style={{ width: 100 }}
                            />
                            {availability[day.key].timeSlots.length > 1 && (
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                size="sm"
                                onClick={() => removeTimeSlot(day.key, slot.id)}
                                aria-label="Remover horário"
                              >
                                <IconX size={16} />
                              </ActionIcon>
                            )}
                          </Group>
                        )
                      )}
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed" ta="center" py="md">
                      Dia desabilitado
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
