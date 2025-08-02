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
  Divider,
  Timeline,
  Textarea,
  ActionIcon,
  rem,
  Tabs
} from '@mantine/core'
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
  IconPencil
} from '@tabler/icons-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import { PageLayout } from '../../../components/layout'

export const Route = createFileRoute('/app/pacientes/$id')({
  component: PacienteDetalhePage,
})

const mockPaciente = {
  id: 1,
  nome: 'Maria Silva Santos',
  email: 'maria.santos@email.com',
  telefone: '(11) 99999-1111',
  celular: '(11) 88888-1111',
  dataNascimento: '1985-03-15',
  cpf: '123.456.789-01',
  rg: '12.345.678-9',
  estadoCivil: 'Casada',
  profissao: 'Enfermeira',
  endereco: {
    cep: '01234-567',
    rua: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    complemento: 'Apto 45'
  },
  status: 'ativo',
  queixaPrincipal: 'Ansiedade generalizada com episódios de pânico',
  historicoPsiquiatrico: 'Primeira vez em tratamento psicológico',
  medicamentosAtual: 'Sertralina 50mg (1x ao dia)',
  alergias: 'Dipirona',
  emergencia: {
    nome: 'João Santos (Esposo)',
    telefone: '(11) 99999-2222',
    parentesco: 'Cônjuge'
  },
  anamnese: {
    motivoConsulta: 'Episódios de ansiedade e pânico no trabalho, dificuldade para dormir',
    expectativas: 'Aprender a controlar a ansiedade e melhorar qualidade do sono',
    historiaDoencaAtual: 'Sintomas iniciaram há 6 meses após mudança de setor no trabalho',
    historicoFamiliar: 'Mãe com histórico de depressão',
    antecedentePsiquiatrico: 'Nenhum',
    usoSubstancias: 'Eventual consumo de álcool socialmente'
  },
  observacoes: 'Paciente muito colaborativa, demonstra insight sobre sua condição'
}

const mockConsultas = [
  {
    id: 1,
    data: '2024-01-30',
    duracao: 50,
    tipo: 'Consulta Individual',
    queixaApresentada: 'Episódio de pânico durante reunião de trabalho',
    evolucao: 'Paciente relatou episódio de pânico na semana anterior. Trabalhamos técnicas de respiração e reestruturação cognitiva. Paciente demonstrou boa compreensão das técnicas.',
    notas: 'Prescrever exercícios de relaxamento para casa. Agendar retorno em 1 semana.',
    status: 'realizada'
  },
  {
    id: 2,
    data: '2024-01-23',
    duracao: 50,
    tipo: 'Consulta Individual',
    queixaApresentada: 'Dificuldades para dormir, pensamentos ruminativos',
    evolucao: 'Sessão focada em higiene do sono e técnicas de mindfulness. Paciente relatou melhora nos episódios de ansiedade.',
    notas: 'Introduzir técnicas de mindfulness. Orientações sobre higiene do sono.',
    status: 'realizada'
  },
  {
    id: 3,
    data: '2024-01-16',
    duracao: 50,
    tipo: 'Primeira Consulta',
    queixaApresentada: 'Ansiedade generalizada, episódios de pânico',
    evolucao: 'Primeira consulta. Anamnese completa realizada. Paciente apresenta ansiedade generalizada com episódios de pânico relacionados ao ambiente de trabalho.',
    notas: 'Iniciar psicoeducação sobre ansiedade. Estabelecer vínculo terapêutico.',
    status: 'realizada'
  }
]

function PacienteDetalhePage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('perfil')
  const [editingConsultaId, setEditingConsultaId] = useState<number | null>(null)
  const [notasTemp, setNotasTemp] = useState('')
  const [evolucaoTemp, setEvolucaoTemp] = useState('')

  const calcularIdade = (dataNascimento: string) => {
    return dayjs().diff(dayjs(dataNascimento), 'year')
  }

  const handleEditConsulta = (consulta: any) => {
    setEditingConsultaId(consulta.id)
    setNotasTemp(consulta.notas)
    setEvolucaoTemp(consulta.evolucao)
  }

  const handleSaveConsulta = (consultaId: number) => {
    // Aqui você salvaria as alterações na API
    console.log('Salvando consulta:', consultaId, { notas: notasTemp, evolucao: evolucaoTemp })
    setEditingConsultaId(null)
    setNotasTemp('')
    setEvolucaoTemp('')
  }

  const handleCancelEdit = () => {
    setEditingConsultaId(null)
    setNotasTemp('')
    setEvolucaoTemp('')
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Pacientes', href: '/app/pacientes' },
        { label: mockPaciente.nome, isCurrentPage: true }
      ]}
      title={mockPaciente.nome}
      primaryAction={{
        label: 'Editar',
        icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
        variant: 'light',
        onClick: () => router.navigate({ to: '/app/pacientes/novo', search: { id } })
      }}
      headerChildren={
        <Group gap="md" mt="xs">
          <Avatar size={60} radius="md">
            {mockPaciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Avatar>
          <Group gap="md">
            <Badge color={mockPaciente.status === 'ativo' ? 'green' : 'gray'} variant="light">
              {mockPaciente.status}
            </Badge>
            <Text size="sm" c="dimmed">
              {calcularIdade(mockPaciente.dataNascimento)} anos
            </Text>
            <Text size="sm" c="dimmed">
              CPF: {mockPaciente.cpf}
            </Text>
          </Group>
        </Group>
      }
    >

      <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="perfil" leftSection={<IconUser style={{ width: rem(16), height: rem(16) }} />}>
              Perfil
            </Tabs.Tab>
            <Tabs.Tab value="consultas" leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}>
              Consultas
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="perfil" pt="lg">
            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder radius="md" p="xl">
                  <Stack gap="md" align="center">
                    <Avatar size={120} radius="md">
                      {mockPaciente.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    
                    <div style={{ textAlign: 'center' }}>
                      <Title order={3}>{mockPaciente.nome}</Title>
                      <Text c="dimmed">{calcularIdade(mockPaciente.dataNascimento)} anos</Text>
                      <Badge color={mockPaciente.status === 'ativo' ? 'green' : 'gray'} mt="xs">
                        {mockPaciente.status}
                      </Badge>
                    </div>

                    <Stack gap="xs" w="100%">
                      <Group gap="xs">
                        <IconPhone style={{ width: rem(16), height: rem(16) }} />
                        <Text size="sm">{mockPaciente.telefone}</Text>
                      </Group>
                      {mockPaciente.celular && (
                        <Group gap="xs">
                          <IconPhone style={{ width: rem(16), height: rem(16) }} />
                          <Text size="sm">{mockPaciente.celular}</Text>
                        </Group>
                      )}
                      <Group gap="xs">
                        <IconMail style={{ width: rem(16), height: rem(16) }} />
                        <Text size="sm">{mockPaciente.email}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconMapPin style={{ width: rem(16), height: rem(16) }} />
                        <Text size="sm">
                          {mockPaciente.endereco.rua}, {mockPaciente.endereco.bairro}
                        </Text>
                      </Group>
                    </Stack>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  {/* Dados Pessoais */}
                  <Card withBorder radius="md" p="xl">
                    <Title order={4} mb="md">Dados Pessoais</Title>
                    <Grid>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>CPF:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.cpf}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>RG:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.rg}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>Estado Civil:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.estadoCivil}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>Profissão:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.profissao}</Text>
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <Text size="sm" fw={500}>Data de Nascimento:</Text>
                        <Text size="sm" c="dimmed">
                          {dayjs(mockPaciente.dataNascimento).format('DD/MM/YYYY')}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Card>

                  {/* Informações Clínicas */}
                  <Card withBorder radius="md" p="xl">
                    <Title order={4} mb="md">Informações Clínicas</Title>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" fw={500}>Queixa Principal:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.queixaPrincipal}</Text>
                      </div>
                      <div>
                        <Text size="sm" fw={500}>Medicamentos Atuais:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.medicamentosAtual}</Text>
                      </div>
                      <div>
                        <Text size="sm" fw={500}>Alergias:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.alergias}</Text>
                      </div>
                    </Stack>
                  </Card>

                  {/* Contato de Emergência */}
                  <Card withBorder radius="md" p="xl">
                    <Title order={4} mb="md">Contato de Emergência</Title>
                    <Grid>
                      <Grid.Col span={8}>
                        <Text size="sm" fw={500}>Nome:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.emergencia.nome}</Text>
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <Text size="sm" fw={500}>Telefone:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.emergencia.telefone}</Text>
                      </Grid.Col>
                    </Grid>
                  </Card>
                </Stack>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="consultas" pt="lg">
            <Card withBorder radius="md" p="xl">
              <Group justify="space-between" mb="lg">
                <Title order={4}>Linha do Tempo das Consultas</Title>
                <Button leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}>
                  Nova Consulta
                </Button>
              </Group>

              <Timeline active={mockConsultas.length} bulletSize={24} lineWidth={2}>
                {mockConsultas.map((consulta, index) => (
                  <Timeline.Item
                    key={consulta.id}
                    bullet={<IconClockHour3 style={{ width: rem(12), height: rem(12) }} />}
                    title={
                      <Group justify="space-between">
                        <div>
                          <Text fw={500}>{consulta.tipo}</Text>
                          <Text size="sm" c="dimmed">
                            {dayjs(consulta.data).format('DD/MM/YYYY')} - {consulta.duracao} min
                          </Text>
                        </div>
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleEditConsulta(consulta)}
                        >
                          <IconPencil style={{ width: rem(14), height: rem(14) }} />
                        </ActionIcon>
                      </Group>
                    }
                  >
                    <Stack gap="md" mt="sm">
                      <div>
                        <Text size="sm" fw={500} mb="xs">Queixa Apresentada:</Text>
                        <Text size="sm" c="dimmed">{consulta.queixaApresentada}</Text>
                      </div>
                      
                      <div>
                        <Text size="sm" fw={500} mb="xs">Evolução da Sessão:</Text>
                        {editingConsultaId === consulta.id ? (
                          <Textarea
                            value={evolucaoTemp}
                            onChange={(e) => setEvolucaoTemp(e.target.value)}
                            rows={3}
                            placeholder="Evolução da sessão..."
                          />
                        ) : (
                          <Text size="sm" c="dimmed">{consulta.evolucao}</Text>
                        )}
                      </div>
                      
                      <div>
                        <Text size="sm" fw={500} mb="xs">Notas e Orientações:</Text>
                        {editingConsultaId === consulta.id ? (
                          <Stack gap="sm">
                            <Textarea
                              value={notasTemp}
                              onChange={(e) => setNotasTemp(e.target.value)}
                              rows={2}
                              placeholder="Notas e orientações..."
                            />
                            <Group gap="xs">
                              <Button
                                size="xs"
                                leftSection={<IconDeviceFloppy style={{ width: rem(12), height: rem(12) }} />}
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
                          <Text size="sm" c="dimmed">{consulta.notas}</Text>
                        )}
                      </div>
                    </Stack>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Tabs.Panel>
        </Tabs>
    </PageLayout>
  )
}