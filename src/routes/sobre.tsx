import {
  Container,
  Title,
  Text,
  Stack,
  Badge,
  SimpleGrid,
  Card,
  Button,
} from '@mantine/core'
import { Link } from '@tanstack/react-router'
import styles from './sobre.module.css'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sobre')({
  component: SobrePage,
})

function SobrePage() {
  return (
    <>
      {/* HERO */}
      <Container size="md" className={styles.hero}>
        <Stack gap="lg" align="center">
          <Title ta="center" className={styles.title}>
            Um sistema pensado para
            <br />
            quem atende pessoas
          </Title>

          <Text c="dimmed" ta="center" maw={560}>
            O MindMeet nasceu com uma ideia simples: reduzir a fricção da rotina
            clínica e devolver tempo para o que realmente importa.
          </Text>
        </Stack>
      </Container>

      {/* HISTÓRIA */}
      <Container size="sm" className={styles.section}>
        <Stack gap="md">
          <Badge color="gray" variant="light">
            Origem
          </Badge>

          <Title order={2}>Por que o MindMeet existe</Title>

          <Text c="dimmed">
            A rotina clínica muitas vezes depende de ferramentas genéricas:
            agendas improvisadas, anotações dispersas e processos pouco
            integrados. Isso gera ruído, retrabalho e perda de foco.
          </Text>

          <Text c="dimmed">
            O MindMeet foi criado para centralizar esse fluxo em um único lugar
            — com uma experiência simples, direta e sem excesso de complexidade.
          </Text>
        </Stack>
      </Container>

      {/* PRINCÍPIOS */}
      <Container size="lg" className={styles.section}>
        <Stack gap="xs" mb="xl">
          <Badge color="fuchsia" variant="light">
            Princípios
          </Badge>

          <Title order={2}>Como o produto é pensado</Title>

          <Text c="dimmed" maw={520}>
            Cada decisão de design busca manter o sistema útil no dia a dia, sem
            adicionar camadas desnecessárias.
          </Text>
        </Stack>

        <SimpleGrid cols={3} spacing="lg">
          <Card className={styles.card}>
            <Title order={4}>Clareza</Title>
            <Text size="sm" c="dimmed">
              Interface limpa, com foco no que precisa ser feito.
            </Text>
          </Card>

          <Card className={styles.card}>
            <Title order={4}>Fluxo contínuo</Title>
            <Text size="sm" c="dimmed">
              Menos interrupções, mais continuidade no atendimento.
            </Text>
          </Card>

          <Card className={styles.card}>
            <Title order={4}>Privacidade</Title>
            <Text size="sm" c="dimmed">
              Dados tratados com cuidado e responsabilidade.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>

      {/* PARA QUEM */}
      <Container size="lg" className={styles.section}>
        <Stack gap="xs" mb="xl">
          <Badge color="gray" variant="light">
            Uso
          </Badge>

          <Title order={2}>Para quem é o MindMeet</Title>
        </Stack>

        <SimpleGrid cols={2} spacing="lg">
          <Card className={styles.card}>
            <Title order={4}>Profissionais autônomos</Title>
            <Text size="sm" c="dimmed">
              Organize sua agenda, pacientes e registros sem depender de
              múltiplas ferramentas.
            </Text>
          </Card>

          <Card className={styles.card}>
            <Title order={4}>Clínicas e instituições</Title>
            <Text size="sm" c="dimmed">
              Tenha uma visão centralizada da equipe e do atendimento.
            </Text>
          </Card>
        </SimpleGrid>
      </Container>

      {/* STACK */}
      {/* <Container size="sm" className={styles.section}>
        <Stack gap="xs">
          <Badge color="indigo" variant="light">
            Tecnologia
          </Badge>

          <Title order={2}>Construído com ferramentas modernas</Title>

          <Text c="dimmed">
            O MindMeet é desenvolvido com uma stack atual, focada em
            performance, segurança e evolução contínua.
          </Text>

          <Group mt="md">
            {[
              'Django REST',
              'React',
              'TypeScript',
              'Mantine',
              'TanStack',
              'PostgreSQL',
            ].map((tech) => (
              <Badge key={tech} variant="light">
                {tech}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Container> */}

      {/* CTA */}
      <Container size="sm" className={styles.cta}>
        <Stack align="center" gap="md">
          <Title ta="center">Experimente na prática</Title>

          <Text c="dimmed" ta="center">
            Crie sua conta gratuita e veja como pode ser mais simples organizar
            sua rotina clínica.
          </Text>

          <Button component={Link} to="/cadastro" radius="xl" color="fuchsia">
            Criar conta gratuita
          </Button>
        </Stack>
      </Container>
    </>
  )
}
