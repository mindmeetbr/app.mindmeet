import type { Paciente } from '../../../../../api/models'
import { Card, Grid, Title, Text } from '@mantine/core'

type Props = Pick<Paciente, 'endereco'>

export default function CardEndereco({ endereco }: Props) {
  return (
    <Card withBorder radius="md" p="xl">
      <Title order={4} mb="md">
        Endereço
      </Title>
      {endereco ? (
        <Grid>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              CEP:
            </Text>
            <Text size="sm" c="dimmed">
              {endereco.cep ?? 'Não cadastrado'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              Rua:
            </Text>
            <Text size="sm" c="dimmed">
              {endereco.rua ?? 'Não cadastrada'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              Número:
            </Text>
            <Text size="sm" c="dimmed">
              {endereco.numero ?? 'Não cadastrado'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              Complemento:
            </Text>
            <Text size="sm" c="dimmed">
              {endereco.complemento ?? 'Não cadastrado'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              Bairro:
            </Text>
            <Text size="sm" c="dimmed">
              {endereco.bairro ?? 'Não cadastrado'}
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 6, sm: 4 }}>
            <Text size="sm" fw={500}>
              Cidade/UF:
            </Text>
            <Text size="sm" c="dimmed">
              {endereco.cidade && endereco.uf
                ? `${endereco.cidade} / ${endereco.uf}`
                : (endereco.cidade ?? endereco.uf ?? 'Não cadastrado')}
            </Text>
          </Grid.Col>
        </Grid>
      ) : (
        <Text size="sm">Sem endereço cadastrado</Text>
      )}
    </Card>
  )
}
