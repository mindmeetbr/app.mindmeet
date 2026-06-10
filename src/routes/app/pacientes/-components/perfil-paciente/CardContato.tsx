import type { Paciente } from '../../../../../api/models'
import { Card, Grid, Title, Text } from '@mantine/core'

type Props = Pick<Paciente, 'numero_telefone' | 'numero_celular' | 'email'>

export default function CardContato({
  numero_telefone,
  numero_celular,
  email,
}: Props) {
  return (
    <Card withBorder radius="md" p="xl">
      <Title order={4} mb="md">
        Dados para Contato
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Text size="sm" fw={500}>
            Número de telefone:
          </Text>
          <Text size="sm" c="dimmed">
            {numero_telefone}
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Text size="sm" fw={500}>
            Número de celular:
          </Text>
          <Text size="sm" c="dimmed">
            {numero_celular
              ? numero_celular
              : 'Sem número de celular cadastrado'}
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Text size="sm" fw={500}>
            Endereço de e-mail:
          </Text>
          <Text size="sm" c="dimmed">
            {email}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  )
}
