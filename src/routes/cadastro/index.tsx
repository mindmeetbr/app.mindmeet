import { createFileRoute, Link } from '@tanstack/react-router'

import {
  Container,
  Stack,
  Title,
  SimpleGrid,
  Card,
  Text,
  List,
  Button,
  Group,
  ThemeIcon,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'

export const Route = createFileRoute('/cadastro/')({
  component: TipoCadastro,
})

function TipoCadastro() {
  const planos = [
    {
      tipo: 'Psicólogo',
      descricao:
        'Voltado para profissionais da psicologia que desejam gerenciar atendimentos e acompanhar pacientes.',
      funcionalidades: [
        'Gerenciamento de agenda e horários disponíveis',
        'Controle de solicitações de agendamento',
        'Histórico de atendimentos e anotações de sessões',
        'Visualização de prontuários e anamneses',
      ],
      rota: '/cadastro/psicologo',
      cor: 'teal',
    },
    {
      tipo: 'Gestor',
      descricao:
        'Ideal para coordenadores de instituições que gerenciam equipes de psicólogos.',
      funcionalidades: [
        'Cadastro e gerenciamento de psicólogos vinculados',
        'Cadastro e gerenciamento de pacientes entre a instituição',
        'Controle de estágiarios e supervisores',
        'Monitorar dados de psicólogos e seus pacientes',
      ],
      rota: '/cadastro/gestor',
      cor: 'blue',
    },
  ]

  return (
    <Container size="md" py="xl">
      <Stack align="center" mb="xl">
        <Title order={2} ta="center">
          Escolha o tipo de conta
        </Title>
        <Text c="dimmed" ta="center" size="sm" maw={500}>
          Selecione o tipo de conta que melhor se encaixa no seu perfil para
          continuar com o cadastro.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {planos.map(plano => (
          <Card
            key={plano.tipo}
            withBorder
            radius="md"
            shadow="sm"
            padding="lg"
          >
            <Stack gap="xs">
              <Title order={3}>{plano.tipo}</Title>
              <Text size="sm" c="dimmed">
                {plano.descricao}
              </Text>

              <List
                spacing="xs"
                size="sm"
                mt="sm"
                icon={
                  <ThemeIcon color={plano.cor} size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
              >
                {plano.funcionalidades.map(f => (
                  <List.Item key={f}>{f}</List.Item>
                ))}
              </List>

              <Group justify="center" mt="md">
                <Button
                  component={Link}
                  to={plano.rota}
                  color={plano.cor}
                  radius="md"
                >
                  Criar conta de {plano.tipo}
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  )
}
