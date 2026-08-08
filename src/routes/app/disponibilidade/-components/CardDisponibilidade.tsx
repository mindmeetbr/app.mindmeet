import { useState } from 'react'
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Collapse,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import {
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconX,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import type { DisponibilidadeLocal, HorarioLocal } from '../-types'

interface CardDisponibilidadeProps {
  dia: DisponibilidadeLocal
  onSalvar: (dia: DisponibilidadeLocal) => Promise<void>
}

export function CardDisponibilidade({
  dia,
  onSalvar,
}: CardDisponibilidadeProps) {
  const [aberto, setAberto] = useState(false)
  const [estado, setEstado] = useState<DisponibilidadeLocal>(dia)
  const [alterado, setAlterado] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const atualizar = (novoEstado: DisponibilidadeLocal) => {
    setEstado(novoEstado)
    setAlterado(true)
  }

  const handleAtivo = (ativo: boolean) => {
    atualizar({ ...estado, ativo })
  }

  const handleAdicionarHorario = () => {
    const novoHorario: HorarioLocal = {
      id: crypto.randomUUID(),
      inicio: '',
      fim: '',
    }
    atualizar({ ...estado, horarios: [...estado.horarios, novoHorario] })
  }

  const handleRemoverHorario = (id: string) => {
    atualizar({
      ...estado,
      horarios: estado.horarios.filter(h => h.id !== id),
    })
  }

  const handleHorarioChange = (
    id: string,
    campo: 'inicio' | 'fim',
    valor: string
  ) => {
    atualizar({
      ...estado,
      horarios: estado.horarios.map(h =>
        h.id === id ? { ...h, [campo]: valor } : h
      ),
    })
  }

  const handleSalvar = async () => {
    setSalvando(true)
    try {
      await onSalvar(estado)
      setAlterado(false)
      notifications.show({
        title: 'Sucesso!',
        message: `Disponibilidade para ${estado.dia_semana} salva com sucesso.`,
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Erro',
        message: `Não foi possível salvar sua disponibilidade para ${estado.dia_semana}, tente novamente.`,
        color: 'red',
      })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Card withBorder radius="md" p="md">
      <Group
        justify="space-between"
        align="center"
        style={{ cursor: 'pointer' }}
        onClick={() => setAberto(a => !a)}
      >
        <Group gap="sm" align="center">
          <Switch
            checked={estado.ativo}
            size="sm"
            onChange={e => {
              e.stopPropagation()
              handleAtivo(e.currentTarget.checked)
            }}
            onClick={e => e.stopPropagation()}
          />
          <Text fw={700} size="sm">
            {estado.dia_semana}
          </Text>
          {!estado.ativo && (
            <Text size="xs" c="dimmed">
              (desativado)
            </Text>
          )}
        </Group>

        <ActionIcon variant="subtle" color="gray" size="sm">
          {aberto ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Group>

      <Collapse in={aberto}>
        <Divider my="md" />

        {!estado.ativo ? (
          <Text size="sm" c="dimmed" ta="center" py="xs">
            Este dia está desativado. Ative o switch para configurar horários.
          </Text>
        ) : (
          <Stack gap="xs">
            {estado.horarios.length === 0 && (
              <Text size="sm" c="dimmed" ta="center" py="xs">
                Nenhum horário cadastrado.
              </Text>
            )}

            {estado.horarios.map(horario => (
              <Group key={horario.id} justify="space-between" align="center">
                <Group gap="xs" align="center">
                  <TimeInput
                    size="sm"
                    style={{ width: 80 }}
                    styles={{ input: { textAlign: 'center' } }}
                    value={horario.inicio.slice(0, 5)}
                    onChange={e =>
                      handleHorarioChange(
                        horario.id,
                        'inicio',
                        e.currentTarget.value
                      )
                    }
                  />
                  <Text size="sm" c="dimmed">
                    até
                  </Text>
                  <TimeInput
                    size="sm"
                    style={{ width: 80 }}
                    styles={{ input: { textAlign: 'center' } }}
                    value={horario.fim.slice(0, 5)}
                    onChange={e =>
                      handleHorarioChange(
                        horario.id,
                        'fim',
                        e.currentTarget.value
                      )
                    }
                  />
                </Group>

                <Tooltip label="Remover horário">
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="md"
                    onClick={() => handleRemoverHorario(horario.id)}
                    aria-label="Remover horário"
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ))}

            <Box>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftSection={<IconPlus size={16} />}
                onClick={handleAdicionarHorario}
                mt="xs"
              >
                Adicionar horário
              </Button>
            </Box>
          </Stack>
        )}

        <Group justify="flex-end" mt="md">
          <Button
            size="sm"
            fullWidth
            disabled={!alterado}
            loading={salvando}
            onClick={handleSalvar}
          >
            Salvar
          </Button>
        </Group>
      </Collapse>
    </Card>
  )
}
