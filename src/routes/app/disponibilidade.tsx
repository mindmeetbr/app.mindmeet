import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  Stack,
  Group,
  Switch,
  Text,
  Button,
  TextInput,
  ActionIcon,
  Box,
  Divider,
  LoadingOverlay,
  Accordion,
} from '@mantine/core'
import { IconPlus, IconX } from '@tabler/icons-react'
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

function RouteComponent() {
  const [availability, setAvailability] = useState<AvailabilityData>(() => {
    const initial: AvailabilityData = {}
    DAYS_OF_WEEK.forEach(day => {
      initial[day.key] = {
        enabled: ['monday', 'tuesday', 'wednesday'].includes(day.key),
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
                    {availability[day.key].timeSlots.map((slot, slotIndex) => (
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
                    ))}
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
    </PageLayout>
  )
}
