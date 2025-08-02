import { createFileRoute } from '@tanstack/react-router'
import { 
  Container,
  Grid,
  Card,
  Avatar,
  Text,
  Title,
  Group,
  Stack,
  Badge,
  Button,
  Divider,
  List,
  ThemeIcon,
  rem
} from '@mantine/core'
import { FinancialValue } from '../../components/ui/FinancialValue'
import { 
  IconMapPin, 
  IconPhone, 
  IconMail, 
  IconClock,
  IconCheck,
  IconCalendar,
  IconStar
} from '@tabler/icons-react'

export const Route = createFileRoute('/psicologo/$id')({
  component: PerfilPsicologo,
})

const mockPsicologoData = {
  id: '1',
  nome: 'Dr. Ana Silva',
  especialidade: 'Psicologia Clínica',
  crp: 'CRP 06/123456',
  avatar: null,
  bio: 'Psicóloga especialista em terapia cognitivo-comportamental com mais de 10 anos de experiência. Atendimento a adultos, adolescentes e casais. Formação em Psicologia pela USP e especialização em TCC pelo Instituto Beck.',
  rating: 4.8,
  totalAvaliacoes: 127,
  endereco: {
    rua: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    complemento: 'Sala 45'
  },
  contato: {
    telefone: '(11) 99999-9999',
    email: 'ana.silva@email.com',
    whatsapp: '11999999999'
  },
  horarioAtendimento: {
    segunda: '08:00 - 18:00',
    terca: '08:00 - 18:00',
    quarta: '08:00 - 18:00',
    quinta: '08:00 - 18:00',
    sexta: '08:00 - 17:00',
    sabado: '08:00 - 12:00',
    domingo: 'Fechado'
  },
  especialidades: [
    'Terapia Cognitivo-Comportamental',
    'Terapia de Casal',
    'Transtornos de Ansiedade',
    'Depressão',
    'Terapia Familiar'
  ],
  formacoes: [
    'Graduação em Psicologia - USP (2012)',
    'Especialização em TCC - Instituto Beck (2014)',
    'Mestrado em Psicologia Clínica - PUC-SP (2016)'
  ],
  valorConsulta: 180,
  tempoConsulta: 50,
  modalidades: ['Presencial', 'Online']
}

function PerfilPsicologo() {
  const { id } = Route.useParams()
  const psicologo = mockPsicologoData // Em uma aplicação real, você buscaria os dados pela ID

  return (
    <Container size="lg" py="xl">
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="md" p="xl" mb="lg">
            <Group align="start" mb="lg">
              <Avatar size={120} src={psicologo.avatar} radius="md">
                {psicologo.nome.split(' ').map(n => n[0]).join('')}
              </Avatar>
              
              <Stack gap="sm" style={{ flex: 1 }}>
                <div>
                  <Title order={2}>{psicologo.nome}</Title>
                  <Text c="dimmed" size="lg">{psicologo.especialidade}</Text>
                  <Text c="dimmed" size="sm">{psicologo.crp}</Text>
                </div>
                
                <Group gap="sm">
                  <Group gap={4}>
                    <IconStar style={{ width: rem(16), height: rem(16) }} fill="var(--mantine-color-yellow-5)" color="var(--mantine-color-yellow-5)" />
                    <Text fw={500}>{psicologo.rating}</Text>
                    <Text c="dimmed" size="sm">({psicologo.totalAvaliacoes} avaliações)</Text>
                  </Group>
                </Group>

                <Group gap="sm">
                  {psicologo.modalidades.map((modalidade) => (
                    <Badge key={modalidade} variant="light" color="blue">
                      {modalidade}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </Group>

            <Divider mb="lg" />

            <Stack gap="lg">
              <div>
                <Title order={4} mb="sm">Sobre</Title>
                <Text>{psicologo.bio}</Text>
              </div>

              <div>
                <Title order={4} mb="sm">Especialidades</Title>
                <List
                  spacing="xs"
                  size="sm"
                  icon={
                    <ThemeIcon color="blue" size={20} radius="xl">
                      <IconCheck style={{ width: rem(12), height: rem(12) }} />
                    </ThemeIcon>
                  }
                >
                  {psicologo.especialidades.map((esp, index) => (
                    <List.Item key={index}>{esp}</List.Item>
                  ))}
                </List>
              </div>

              <div>
                <Title order={4} mb="sm">Formação Acadêmica</Title>
                <List spacing="xs" size="sm">
                  {psicologo.formacoes.map((formacao, index) => (
                    <List.Item key={index}>{formacao}</List.Item>
                  ))}
                </List>
              </div>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            {/* Card de Agendamento */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="lg">
                <div>
                  <Group justify="space-between" mb="sm">
                    <Text fw={600}>Consulta</Text>
                    <Badge variant="light" color="green">Disponível</Badge>
                  </Group>
                  
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" c="dimmed">Valor</Text>
                    <FinancialValue 
                      value={psicologo.valorConsulta}
                      prefix="R$ "
                      weight={500}
                      size="sm"
                    />
                  </Group>
                  
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">Duração</Text>
                    <Text fw={500}>{psicologo.tempoConsulta} min</Text>
                  </Group>
                </div>

                <Button 
                  fullWidth 
                  leftSection={<IconCalendar style={{ width: rem(16), height: rem(16) }} />}
                >
                  Agendar Consulta
                </Button>
                
                <Button 
                  variant="light" 
                  fullWidth
                  leftSection={<IconPhone style={{ width: rem(16), height: rem(16) }} />}
                >
                  Entrar em Contato
                </Button>
              </Stack>
            </Card>

            {/* Card de Localização */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Group>
                  <IconMapPin style={{ width: rem(20), height: rem(20) }} color="var(--mantine-color-blue-6)" />
                  <Text fw={600}>Localização</Text>
                </Group>
                
                <div>
                  <Text size="sm">{psicologo.endereco.rua}</Text>
                  <Text size="sm">{psicologo.endereco.bairro}</Text>
                  <Text size="sm">{psicologo.endereco.cidade} - {psicologo.endereco.estado}</Text>
                  {psicologo.endereco.complemento && (
                    <Text size="sm" c="dimmed">{psicologo.endereco.complemento}</Text>
                  )}
                </div>
              </Stack>
            </Card>

            {/* Card de Contato */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Text fw={600}>Contato</Text>
                
                <Group>
                  <IconPhone style={{ width: rem(16), height: rem(16) }} color="var(--mantine-color-blue-6)" />
                  <Text size="sm">{psicologo.contato.telefone}</Text>
                </Group>
                
                <Group>
                  <IconMail style={{ width: rem(16), height: rem(16) }} color="var(--mantine-color-blue-6)" />
                  <Text size="sm">{psicologo.contato.email}</Text>
                </Group>
              </Stack>
            </Card>

            {/* Card de Horários */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Group>
                  <IconClock style={{ width: rem(20), height: rem(20) }} color="var(--mantine-color-blue-6)" />
                  <Text fw={600}>Horários de Atendimento</Text>
                </Group>
                
                <Stack gap="xs">
                  {Object.entries(psicologo.horarioAtendimento).map(([dia, horario]) => (
                    <Group key={dia} justify="space-between">
                      <Text size="sm" tt="capitalize">{dia}</Text>
                      <Text size="sm" c={horario === 'Fechado' ? 'dimmed' : undefined}>
                        {horario}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  )
}