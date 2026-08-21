import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Badge,
  SimpleGrid,
  Card,
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import styles from './index.module.css'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      {/* HERO */}
      <Container size="md" className={styles.hero}>
        <Stack gap="lg" align="center">
          <Badge color="indigo" variant="light">
            Gestão clínica simplificada
          </Badge>

          <Title ta="center" className={styles.title}>
            Organize sua rotina clínica sem esforço
          </Title>

          <Text c="dimmed" size="lg" ta="center" maw={520}>
            Agenda, pacientes e registros em um só lugar — pensado para
            psicólogos que querem mais clareza no dia a dia.
          </Text>

          <Group>
            <Button component={Link} to="/cadastro" size="md" radius="xl">
              Criar conta gratuita
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* FUNCIONALIDADES */}
      <Container size="lg" id="funcionalidades" className={styles.section}>
        <Stack gap="xs" mb="xl">
          <Badge color="fuchsia" variant="light">
            Funcionalidades
          </Badge>

          <Title order={2}>Tudo que você precisa para atender melhor</Title>

          <Text c="dimmed">
            Sem complexidade desnecessária — apenas o essencial para organizar
            sua prática clínica.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          <Card className={styles.card} radius="md" padding="lg">
            <Title order={4}>Agenda</Title>
            <Text size="sm" c="dimmed">
              Visualize sua semana com clareza e evite conflitos
              automaticamente.
            </Text>
          </Card>

          <Card className={styles.card} radius="md" padding="lg">
            <Title order={4}>Pacientes</Title>
            <Text size="sm" c="dimmed">
              Centralize informações importantes em um só lugar.
            </Text>
          </Card>

          <Card className={styles.card} radius="md" padding="lg">
            <Title order={4}>Registros</Title>
            <Text size="sm" c="dimmed">
              Acompanhe a evolução clínica com histórico organizado.
            </Text>
          </Card>

          <Card className={styles.card} radius="md" padding="lg">
            <Title order={4}>Notificações</Title>
            <Text size="sm" c="dimmed">
              Receba lembretes importantes do seu fluxo de atendimento.
            </Text>
          </Card>

          <Card className={styles.card} radius="md" padding="lg">
            <Title order={4}>Institucional</Title>
            <Text size="sm" c="dimmed">
              Gerencie equipes e supervisões em um único sistema.
            </Text>
          </Card>

          <Card className={styles.card} radius="md" padding="lg">
            <Title order={4}>Segurança</Title>
            <Text size="sm" c="dimmed">
              Dados protegidos com autenticação segura e boas práticas.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>

      {/* CTA FINAL */}
      <Container size="sm" className={styles.cta}>
        <Stack align="center" gap="md">
          <Title ta="center">Comece a organizar sua prática hoje</Title>

          <Text c="dimmed" ta="center">
            Crie sua conta gratuitamente e veja como pode ser mais simples.
          </Text>

          <Button
            component={Link}
            to="/cadastro"
            size="md"
            radius="xl"
            color="fuchsia"
          >
            Criar conta gratuita
          </Button>
        </Stack>
      </Container>
    </>
  )
}
