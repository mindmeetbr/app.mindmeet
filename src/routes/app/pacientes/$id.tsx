import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Title,
  Card,
  Stack,
  Group,
  Button,
  Text,
  Badge,
  Avatar,
  Grid,
  // Divider,
  Timeline,
  Textarea,
  ActionIcon,
  rem,
  Tabs,
  Modal,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useForm } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import {
  IconEdit,
  IconCalendar,
  IconPhone,
  IconMail,
  IconMapPin,
  IconUser,
  IconClockHour3,
  IconNotes,
  IconDeviceFloppy,
  IconPencil,
} from '@tabler/icons-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { PageLayout } from '../../../components/layout'
import {
  useAnotacaoList,
  useAnotacaoUpdate,
  useAnotacaoCreate,
} from '../../../api/endpoints/anotacoes/anotacoes'
import { usePacienteDetail } from '../../../api/endpoints/pacientes/pacientes'
import type { Anotacao } from '../../../api/models'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'

export const Route = createFileRoute('/app/pacientes/$id')({
  component: PacienteDetalhePage,
})

const calcularIdade = (dataNascimento: string) => {
  return dayjs().diff(dayjs(dataNascimento), 'year')
}

function BotaoNovaConsulta({ desativado }: { desativado?: boolean }) {
  const [opened, { open, close }] = useDisclosure(false)
  const { id } = Route.useParams()
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

  function handleSubmit(values) {
    const dataFormatada = new Date(values.data).toISOString()
    const dados = {
      pacientePk: id,
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

function LinhaDoTempo({ podeEditar }: { podeEditar?: boolean }) {
  const { id } = Route.useParams()
  const { data, isLoading, isError } = useAnotacaoList(id)
  const { mutate: editarAnotacao } = useAnotacaoUpdate()

  const [editingConsultaId, setEditingConsultaId] = useState<number | null>(
    null
  )
  const [registrosTemp, setRegistrosTemp] = useState('')
  const [apresentadaTemp, setApresentadaTemp] = useState('')
  const [identificadaTemp, setIdentificadaTemp] = useState('')

  const handleEditConsulta = (consulta: Anotacao) => {
    setEditingConsultaId(consulta.id)
    setRegistrosTemp(consulta.registros as string)
    setApresentadaTemp(consulta.queixa_apresentada as string)
    setIdentificadaTemp(consulta.queixa_identificada as string)
  }

  const handleSaveConsulta = (consultaId: number) => {
    editarAnotacao({
      pacientePk: id,
      id: consultaId,
      data: {
        registros: registrosTemp,
        queixa_apresentada: apresentadaTemp,
        queixa_identificada: identificadaTemp,
      },
    })

    setEditingConsultaId(null)
    setRegistrosTemp('')
    setApresentadaTemp('')
    setIdentificadaTemp('')

    notifications.show({
      title: 'Anotação editada com sucesso!',
      message: 'Recarregue a página para ver as alterações',
    })
  }

  const handleCancelEdit = () => {
    setEditingConsultaId(null)
    setRegistrosTemp('')
    setApresentadaTemp('')
    setIdentificadaTemp('')
  }

  if (isLoading) {
    return <p>Carregando anotações...</p>
  }

  if (isError) {
    return (
      <p>
        Não foi possível recuperar as anotações sobre o paciente, tente
        novamente.
      </p>
    )
  }

  if (!data) {
    return <p>Nenhuma anotação sobre o paciente</p>
  }

  return (
    <Timeline active={data.length} bulletSize={24} lineWidth={2}>
      {data.map((consulta: Anotacao) => (
        <Timeline.Item
          key={consulta.id}
          bullet={
            <IconClockHour3 style={{ width: rem(12), height: rem(12) }} />
          }
          title={
            <Group justify="space-between">
              <div>
                {/* <Text fw={500}>{consulta.tipo}</Text> */}
                <Text size="sm" c="dimmed">
                  {dayjs(consulta.data).format('DD/MM/YYYY[ - ]HH:mm')}
                </Text>
              </div>
              {podeEditar && (
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={() => handleEditConsulta(consulta)}
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
              {editingConsultaId === consulta.id ? (
                <Textarea
                  value={registrosTemp}
                  onChange={e => setRegistrosTemp(e.target.value)}
                  rows={3}
                  placeholder="Descrição da sessão..."
                />
              ) : (
                <Text size="sm" c="dimmed">
                  {consulta.registros ? consulta.registros : 'Sem descrição'}
                </Text>
              )}
            </div>

            <div>
              <Text size="sm" fw={500} mb="xs">
                Queixa Apresentada:
              </Text>
              {editingConsultaId === consulta.id ? (
                <TextInput
                  value={apresentadaTemp}
                  onChange={e => setApresentadaTemp(e.target.value)}
                  placeholder="Queixa apresentada..."
                />
              ) : (
                <Text size="sm" c="dimmed">
                  {consulta.queixa_apresentada
                    ? consulta.queixa_apresentada
                    : 'Nenhuma queixa apresentada.'}
                </Text>
              )}
            </div>

            <div>
              <Text size="sm" fw={500} mb="xs">
                Queixa Identificada:
              </Text>
              {editingConsultaId === consulta.id ? (
                <Stack>
                  <TextInput
                    value={identificadaTemp}
                    onChange={e => setIdentificadaTemp(e.target.value)}
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
                      onClick={() => handleSaveConsulta(consulta.id)}
                    >
                      Salvar
                    </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </Group>
                </Stack>
              ) : (
                <Text size="sm" c="dimmed">
                  {consulta.queixa_identificada
                    ? consulta.queixa_identificada
                    : 'Nenhuma queixa identificada.'}
                </Text>
              )}
            </div>
          </Stack>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}

function PacienteDetalhePage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('perfil')
  const { data: paciente, isLoading, isError } = usePacienteDetail(id)

  const titulo = paciente?.nome_completo
    ? `Paciente: ${paciente.nome_completo}`
    : 'Paciente'
  useAlterarTitle(titulo)

  if (isLoading) {
    return <Text>Carregando paciente...</Text>
  }

  if (isError || !paciente) {
    return (
      <Text>
        Não foi possível carregar os dados do paciente, tente novamente.
      </Text>
    )
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Pacientes', href: '/app/pacientes' },
        { label: paciente.nome_completo, isCurrentPage: true },
      ]}
      title={paciente.nome_completo}
      primaryAction={
        // se existe acompanhado -> supervisor que está olhando
        paciente.acompanhado_por
          ? undefined
          : {
              label: 'Editar',
              icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
              variant: 'light',
              onClick: () =>
                router.navigate({ to: '/app/pacientes/novo', search: { id } }),
            }
      }
      headerChildren={
        <Group gap="md" mt="xs">
          <Avatar size={60} radius="md">
            {paciente.nome_completo
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <Group gap="md">
            <Text size="sm" c="dimmed">
              {calcularIdade(paciente.data_nascimento)} anos
            </Text>
            <Text size="sm" c="dimmed">
              CPF: {paciente.cpf}
            </Text>
          </Group>
        </Group>
      }
    >
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab
            value="perfil"
            leftSection={
              <IconUser style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Perfil
          </Tabs.Tab>
          <Tabs.Tab
            value="consultas"
            leftSection={
              <IconCalendar style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Consultas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="perfil" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 4 }}>
              <Card withBorder radius="md" p="xl">
                <Stack gap="md" align="center">
                  <Avatar size={120} radius="md">
                    {paciente.nome_completo
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)}
                  </Avatar>

                  <div style={{ textAlign: 'center' }}>
                    <Title order={3}>{paciente.nome_completo}</Title>
                    <Text c="dimmed">
                      {calcularIdade(paciente.data_nascimento)} anos
                    </Text>
                    {paciente?.acompanhado_por && (
                      <Tooltip
                        label={`Acompanhado por ${paciente.acompanhado_por}`}
                      >
                        <Badge variant="outline">
                          {paciente.acompanhado_por}
                        </Badge>
                      </Tooltip>
                    )}
                  </div>

                  <Stack gap="xs" w="100%">
                    <Group gap="xs">
                      <IconPhone style={{ width: rem(16), height: rem(16) }} />
                      <Text size="sm">{paciente.numero_telefone}</Text>
                    </Group>
                    {paciente.numero_celular && (
                      <Group gap="xs">
                        <IconPhone
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <Text size="sm">{paciente.numero_celular}</Text>
                      </Group>
                    )}
                    <Group gap="xs">
                      <IconMail style={{ width: rem(16), height: rem(16) }} />
                      <Text size="sm">{paciente.email}</Text>
                    </Group>
                    {paciente.endereco?.rua && paciente.endereco.bairro && (
                      <Group gap="xs">
                        <IconMapPin
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <Text size="sm">
                          {paciente.endereco.rua}, {paciente.endereco.bairro}
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="lg">
                {/* Dados Pessoais */}
                <Card withBorder radius="md" p="xl">
                  <Title order={4} mb="md">
                    Dados Pessoais
                  </Title>
                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500}>
                        CPF:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {paciente.cpf}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500}>
                        RG:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {paciente.rg ? paciente.rg : 'Sem RG cadastrado'}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500}>
                        Estado Civil:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {paciente.estado_civil
                          ? paciente.estado_civil
                          : 'Sem estado civil cadastrado'}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500}>
                        Profissão:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {paciente.profissao
                          ? paciente.profissao
                          : 'Sem profissão cadastrada'}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Text size="sm" fw={500}>
                        Data de Nascimento:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {dayjs(paciente.data_nascimento).format('DD/MM/YYYY')}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card>

                {/* Informações Clínicas */}
                <Card withBorder radius="md" p="xl">
                  <Title order={4} mb="md">
                    Informações Clínicas
                  </Title>
                  {paciente.informacoes_clinicas ? (
                    <Stack gap="md">
                      <div>
                        <Text size="sm" fw={500}>
                          Queixa Principal:
                        </Text>
                        <Text size="sm" c="dimmed">
                          {paciente.informacoes_clinicas.queixa_principal
                            ? paciente.informacoes_clinicas.queixa_principal
                            : 'Sem queixa principal cadastrada'}
                        </Text>
                      </div>
                      <div>
                        <Text size="sm" fw={500}>
                          Medicamentos Atuais:
                        </Text>
                        <Text size="sm" c="dimmed">
                          {paciente.informacoes_clinicas.medicamentos_atuais
                            ? paciente.informacoes_clinicas.medicamentos_atuais
                            : 'Sem medicamentos cadastrados'}
                        </Text>
                      </div>
                      <div>
                        <Text size="sm" fw={500}>
                          Alergias:
                        </Text>
                        <Text size="sm" c="dimmed">
                          {paciente.informacoes_clinicas.alergias
                            ? paciente.informacoes_clinicas.alergias
                            : 'Sem alergias cadastradas'}
                        </Text>
                      </div>
                    </Stack>
                  ) : (
                    <Text size="sm">Sem informações clínicas cadastradas</Text>
                  )}
                </Card>

                {/* Contato de Emergência */}
                <Card withBorder radius="md" p="xl">
                  <Title order={4} mb="md">
                    Contato de Emergência
                  </Title>
                  {paciente.contato_emergencia ? (
                    <Grid>
                      <Grid.Col span={8}>
                        <Text size="sm" fw={500}>
                          Nome:
                        </Text>
                        <Text size="sm" c="dimmed">
                          {paciente.contato_emergencia.nome
                            ? paciente.contato_emergencia.nome
                            : 'Sem nome para contato de emergência'}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Text size="sm" fw={500}>
                          Telefone:
                        </Text>
                        <Text size="sm" c="dimmed">
                          {paciente.contato_emergencia.numero_telefone
                            ? paciente.contato_emergencia.numero_telefone
                            : 'Sem número para contato de emergência'}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  ) : (
                    <Text size="sm">Sem contato de emergência cadastrado</Text>
                  )}
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="consultas" pt="lg">
          <Card withBorder radius="md" p="xl">
            <Group justify="space-between" mb="lg">
              <Title order={4}>Linha do Tempo das Consultas</Title>
              <BotaoNovaConsulta desativado={!!paciente?.acompanhado_por} />
            </Group>

            <LinhaDoTempo podeEditar={!paciente?.acompanhado_por} />
          </Card>
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  )
}
