import type { Paciente } from '../../../../../api/models'
import { Card, Grid, Title, Text } from '@mantine/core'

type Props = Pick<Paciente, 'informacoes_clinicas'>

export default function CardInformacoesClinicas({
  informacoes_clinicas,
}: Props) {
  return (
    <Card withBorder radius="md" p="xl">
      <Title order={4} mb="md">
        Informações Clínicas
      </Title>
      {informacoes_clinicas ? (
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="sm" fw={500}>
              Queixa Principal:
            </Text>
            <Text size="sm" c="dimmed">
              {informacoes_clinicas.queixa_principal
                ? informacoes_clinicas.queixa_principal
                : 'Sem queixa principal cadastrada'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="sm" fw={500}>
              Medicamentos Atuais:
            </Text>
            <Text size="sm" c="dimmed">
              {informacoes_clinicas.medicamentos_atuais
                ? informacoes_clinicas.medicamentos_atuais
                : 'Sem medicamentos cadastrados'}
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="sm" fw={500}>
              Alergias:
            </Text>
            <Text size="sm" c="dimmed">
              {informacoes_clinicas.alergias
                ? informacoes_clinicas.alergias
                : 'Sem alergias cadastradas'}
            </Text>
          </Grid.Col>
        </Grid>
      ) : (
        <Text size="sm">Sem informações clínicas cadastradas</Text>
      )}
    </Card>
  )
}
