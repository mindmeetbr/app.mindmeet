import type { Paciente } from '../../../../../api/models'
import { Card, Grid, Title, Text } from '@mantine/core'

type Props = Pick<Paciente, 'contato_emergencia'>

export default function CardContatoEmergencia({ contato_emergencia }: Props) {
  return (
    <Card withBorder radius="md" p="xl">
      <Title order={4} mb="md">
        Contato de Emergência
      </Title>
      {contato_emergencia ? (
        <Grid>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              Nome:
            </Text>
            <Text size="sm" c="dimmed">
              {contato_emergencia.nome
                ? contato_emergencia.nome
                : 'Sem nome para contato de emergência'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              Telefone:
            </Text>
            <Text size="sm" c="dimmed">
              {contato_emergencia.numero_telefone
                ? contato_emergencia.numero_telefone
                : 'Sem número para contato de emergência'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <Text size="sm" fw={500}>
              Parentesco:
            </Text>
            <Text size="sm" c="dimmed">
              {contato_emergencia.parentesco
                ? contato_emergencia.parentesco
                : 'Sem parentesco para contato de emergência'}
            </Text>
          </Grid.Col>
        </Grid>
      ) : (
        <Text size="sm">Sem contato de emergência cadastrado</Text>
      )}
    </Card>
  )
}
