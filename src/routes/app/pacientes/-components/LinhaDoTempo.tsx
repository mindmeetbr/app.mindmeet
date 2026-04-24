import {
  Timeline,
  Stack,
  Group,
  Text,
  Textarea,
  TextInput,
  ActionIcon,
  Button,
  Loader,
  Flex,
  rem,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconClockHour3,
  IconPencil,
  IconDeviceFloppy,
} from '@tabler/icons-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import type { Anotacao } from '../../../../api/models'
import { ControlePaginacao } from '../../../../components/ui/ControlePaginacao'
import { usePaginacao } from '../../../../hooks/usePaginacao'
import {
  useAnotacaoList,
  useAnotacaoUpdate,
} from '../../../../api/endpoints/anotacoes/anotacoes'

interface LinhaDoTempoProps {
  pacienteId: string
  podeEditar?: boolean
}

interface ItemConsultaProps {
  consulta: Anotacao
  podeEditar?: boolean
  editandoId: string | null
  registrosTemp: string
  apresentadaTemp: string
  identificadaTemp: string
  onEditar: (consulta: Anotacao) => void
  onSalvar: (id: string) => void
  onCancelar: () => void
  onRegistrosChange: (value: string) => void
  onApresentadaChange: (value: string) => void
  onIdentificadaChange: (value: string) => void
}

function ItemConsulta({
  consulta,
  podeEditar,
  editandoId,
  registrosTemp,
  apresentadaTemp,
  identificadaTemp,
  onEditar,
  onSalvar,
  onCancelar,
  onRegistrosChange,
  onApresentadaChange,
  onIdentificadaChange,
}: ItemConsultaProps) {
  const estaEditando = editandoId === consulta.id

  return (
    <Timeline.Item
      bullet={<IconClockHour3 style={{ width: rem(12), height: rem(12) }} />}
      title={
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {dayjs(consulta.data).format('DD/MM/YYYY[ - ]HH:mm')}
          </Text>
          {podeEditar && !estaEditando && (
            <ActionIcon
              variant="light"
              size="sm"
              onClick={() => onEditar(consulta)}
              aria-label="Editar anotação"
            >
              <IconPencil style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          )}
        </Group>
      }
    >
      <Stack gap="md" mt="sm">
        <div>
          <Text size="md" fw="bold" mb="xs">
            {consulta.titulo}
          </Text>
          {estaEditando ? (
            <Textarea
              value={registrosTemp}
              onChange={e => onRegistrosChange(e.target.value)}
              rows={3}
              placeholder="Descrição da sessão..."
            />
          ) : (
            <Text size="sm" c="dimmed">
              {consulta.registros || 'Sem descrição'}
            </Text>
          )}
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Queixa Apresentada:
          </Text>
          {estaEditando ? (
            <TextInput
              value={apresentadaTemp}
              onChange={e => onApresentadaChange(e.target.value)}
              placeholder="Queixa apresentada..."
            />
          ) : (
            <Text size="sm" c="dimmed">
              {consulta.queixa_apresentada || 'Nenhuma queixa apresentada.'}
            </Text>
          )}
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Queixa Identificada:
          </Text>
          {estaEditando ? (
            <Stack>
              <TextInput
                value={identificadaTemp}
                onChange={e => onIdentificadaChange(e.target.value)}
                placeholder="Queixa identificada..."
              />
              <Group>
                <Button
                  size="xs"
                  leftSection={
                    <IconDeviceFloppy
                      style={{ width: rem(12), height: rem(12) }}
                    />
                  }
                  onClick={() => onSalvar(consulta.id)}
                >
                  Salvar
                </Button>
                <Button size="xs" variant="outline" onClick={onCancelar}>
                  Cancelar
                </Button>
              </Group>
            </Stack>
          ) : (
            <Text size="sm" c="dimmed">
              {consulta.queixa_identificada || 'Nenhuma queixa identificada.'}
            </Text>
          )}
        </div>
      </Stack>
    </Timeline.Item>
  )
}

export function LinhaDoTempo({ pacienteId, podeEditar }: LinhaDoTempoProps) {
  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao({
    tamanhoInicial: 5,
  })

  const { data, isLoading, isError } = useAnotacaoList(
    pacienteId,
    { pagina, tamanho },
    { query: { queryKey: ['anotacoes', pacienteId, pagina, tamanho] } }
  )

  const { mutate: editarAnotacao } = useAnotacaoUpdate()

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [registrosTemp, setRegistrosTemp] = useState('')
  const [apresentadaTemp, setApresentadaTemp] = useState('')
  const [identificadaTemp, setIdentificadaTemp] = useState('')

  const handleEditar = (consulta: Anotacao) => {
    setEditandoId(consulta.id)
    setRegistrosTemp(consulta.registros as string)
    setApresentadaTemp(consulta.queixa_apresentada as string)
    setIdentificadaTemp(consulta.queixa_identificada as string)
  }

  const handleSalvar = (consultaId: string) => {
    editarAnotacao(
      {
        pacientePk: pacienteId,
        id: consultaId,
        data: {
          registros: registrosTemp,
          queixa_apresentada: apresentadaTemp,
          queixa_identificada: identificadaTemp,
        },
      },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Sucesso!',
            message: 'Anotação editada com sucesso.',
            color: 'green',
          })
        },
        onError: () => {
          notifications.show({
            title: 'Erro!',
            message: 'Não foi possível salvar a anotação, tente novamente.',
            color: 'red',
          })
        },
      }
    )
    handleCancelar()
  }

  const handleCancelar = () => {
    setEditandoId(null)
    setRegistrosTemp('')
    setApresentadaTemp('')
    setIdentificadaTemp('')
  }

  if (isLoading) {
    return (
      <Flex justify="center" py="xl">
        <Loader color="indigo" size="sm" type="dots" />
      </Flex>
    )
  }

  if (isError) {
    return (
      <Text c="red" size="sm">
        Não foi possível recuperar as anotações, tente novamente.
      </Text>
    )
  }

  const anotacoes = data?.results ?? []
  const total = data?.count ?? 0

  if (total === 0) {
    return (
      <Text c="dimmed" size="sm" ta="center" py="xl">
        Nenhuma anotação registrada.
      </Text>
    )
  }

  return (
    <Stack>
      <Timeline active={anotacoes.length} bulletSize={24} lineWidth={2}>
        {anotacoes.map(consulta => (
          <ItemConsulta
            key={consulta.id}
            consulta={consulta}
            podeEditar={podeEditar}
            editandoId={editandoId}
            registrosTemp={registrosTemp}
            apresentadaTemp={apresentadaTemp}
            identificadaTemp={identificadaTemp}
            onEditar={handleEditar}
            onSalvar={handleSalvar}
            onCancelar={handleCancelar}
            onRegistrosChange={setRegistrosTemp}
            onApresentadaChange={setApresentadaTemp}
            onIdentificadaChange={setIdentificadaTemp}
          />
        ))}
      </Timeline>

      <ControlePaginacao
        pagina={pagina}
        tamanho={tamanho}
        total={total}
        onPaginaChange={setPagina}
        onTamanhoChange={setTamanho}
      />
    </Stack>
  )
}
