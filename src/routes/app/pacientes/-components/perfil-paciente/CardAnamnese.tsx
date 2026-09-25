import { Card, Grid, Text, Title } from '@mantine/core'
import type { Paciente } from '../../../../../api/models'

type Props = Pick<Paciente, 'anamnese'>

export default function CardAnamnese({ anamnese }: Props) {
  return (
    <Card withBorder radius="md" p="xl">
      <Title order={4} mb="md">
        Anamnese
      </Title>
      {anamnese ? (
        <Grid>
          <Grid.Col span={12}>
            <Text size="sm" fw={500}>
              Motivo da Consulta:
            </Text>
            <Text size="sm" c="dimmed">
              {anamnese.motivo_consulta
                ? anamnese.motivo_consulta
                : 'Sem motivo de consulta cadastrado'}
            </Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" fw={500}>
              Expectativas:
            </Text>
            <Text size="sm" c="dimmed">
              {anamnese.expectativas
                ? anamnese.expectativas
                : 'Sem expectativas cadastradas'}
            </Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" fw={500}>
              História da Doença Atual:
            </Text>
            <Text size="sm" c="dimmed">
              {anamnese.historia_doenca_atual
                ? anamnese.historia_doenca_atual
                : 'Sem história da doença atual cadastrada'}
            </Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" fw={500}>
              Histórico Familiar:
            </Text>
            <Text size="sm" c="dimmed">
              {anamnese.historico_familiar
                ? anamnese.historico_familiar
                : 'Sem histórico familiar cadastrado'}
            </Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" fw={500}>
              Aspectos Observados:
            </Text>
            <Text size="sm" c="dimmed">
              {anamnese.aspectos_observados
                ? anamnese.aspectos_observados
                : 'Sem aspectos observados cadastrados'}
            </Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" fw={500}>
              Uso de Substâncias:
            </Text>
            <Text size="sm" c="dimmed">
              {anamnese.uso_substancias
                ? anamnese.uso_substancias
                : 'Sem uso de substâncias cadastrado'}
            </Text>
          </Grid.Col>

          <Grid.Col span={12}>
            <Text size="sm" fw={500}>
              Observações:
            </Text>
            <Text size="sm" c="dimmed">
              {anamnese.observacoes
                ? anamnese.observacoes
                : 'Sem observações cadastradas'}
            </Text>
          </Grid.Col>
        </Grid>
      ) : (
        <Text size="sm">Sem anamnese cadastrada</Text>
      )}
    </Card>
  )
}
