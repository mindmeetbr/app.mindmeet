import { useDisclosure } from '@mantine/hooks'
import { useAnotacaoCreate } from '../../../../api/endpoints/anotacoes/anotacoes'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  Modal,
  TextInput,
  Group,
  Button,
  Stack,
  rem,
  Textarea,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { IconNotes, IconCalendar } from '@tabler/icons-react'

interface BotaoNovaConsultaProps {
  pacienteId: string
  desativado?: boolean
}

export function BotaoNovaConsulta({
  pacienteId,
  desativado,
}: BotaoNovaConsultaProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const { mutate: criarAnotacao } = useAnotacaoCreate()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      titulo: '',
      registros: '',
      data: new Date(),
      apresentada: '',
      identificada: '',
    },
  })

  function handleSubmit(values: typeof form.values) {
    const dataFormatada = new Date(values.data).toISOString()
    const dados = {
      pacientePk: pacienteId,
      data: {
        titulo: values.titulo,
        registros: values.registros,
        queixa_apresentada: values.apresentada,
        queixa_identificada: values.identificada,
        data: dataFormatada,
      },
    }
    criarAnotacao(dados, {
      onSuccess: () => {
        notifications.show({
          title: 'Sucesso!',
          message: 'Nova anotação criada com sucesso',
          color: 'green',
        })
        form.reset()
        close()
      },
      onError: () => {
        notifications.show({
          title: 'Erro!',
          message: 'Não foi possível criar a anotação, tente novamente',
          color: 'red',
        })
      },
    })
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Nova anotação"
        centered
        size="70%"
        radius="md"
        overlayProps={{
          blur: 2,
          backgroundOpacity: 0.5,
        }}
        styles={{
          title: { fontSize: 20, fontWeight: 600 },
          header: { paddingBottom: 12 },
          body: { paddingTop: 8, paddingBottom: 16 },
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              withAsterisk
              required
              label="Título"
              placeholder="Título da anotação"
              radius="md"
              size="md"
              leftSection={<IconNotes size={18} />}
              key={form.key('titulo')}
              {...form.getInputProps('titulo')}
            />

            <Group grow align="flex-end">
              <TextInput
                label="Queixa Apresentada"
                placeholder="..."
                radius="md"
                key={form.key('apresentada')}
                {...form.getInputProps('apresentada')}
              />

              <TextInput
                label="Queixa Identificada"
                placeholder="..."
                radius="md"
                key={form.key('identificada')}
                {...form.getInputProps('identificada')}
              />
            </Group>

            <DateTimePicker
              locale="pt-br"
              valueFormat="DD [de] MMMM [de] YYYY, HH:mm"
              label="Data"
              placeholder="Selecione a data"
              size="sm"
              radius="md"
              withSeconds={false}
              key={form.key('data')}
              {...form.getInputProps('data')}
            />

            <Textarea
              label="Registros Gerais"
              placeholder="..."
              radius="md"
              size="md"
              autosize
              minRows={3}
              key={form.key('registros')}
              {...form.getInputProps('registros')}
            />

            <Group mt="sm">
              <Button type="submit" radius="md" size="md">
                Salvar
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Button
        leftSection={
          <IconCalendar style={{ width: rem(16), height: rem(16) }} />
        }
        onClick={open}
        disabled={desativado}
      >
        Nova Anotação
      </Button>
    </>
  )
}
