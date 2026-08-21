import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import { IconClockPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { useAdicionarHorarios } from '../../../../api/endpoints/disponibilidades/disponibilidades'
import { AdicionarHorariosDiaEnum } from '../../../../api/models'
import { diasSemana } from '../-useDisponibilidade'

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

export function BotaoAdicionarHorarios() {
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
      <Button
        variant="outline"
        leftSection={<IconClockPlus size={16} />}
        onClick={() => setOpened(true)}
      >
        Adicionar horários em lote
      </Button>

      <Modal
        opened={opened}
        onClose={handleFechar}
        title="Adicionar horários em lote para um dia da semana"
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
