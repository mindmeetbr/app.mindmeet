import type { Paciente } from '../../../../../api/models'
import { Card, Title, Text, Grid } from '@mantine/core'
import dayjs from 'dayjs'

type Props = Pick<
  Paciente,
  | 'nome_completo'
  | 'cpf'
  | 'rg'
  | 'estado_civil'
  | 'profissao'
  | 'data_nascimento'
>

export default function CardDadosPessoais({
  nome_completo,
  cpf,
  rg,
  estado_civil,
  profissao,
  data_nascimento,
}: Props) {
  return (
    <Card withBorder radius="md" p="xl">
      <Title order={4} mb="md">
        Dados Pessoais
      </Title>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="sm" fw={500}>
            Nome completo:
          </Text>
          <Text size="sm" c="dimmed">
            {nome_completo}
          </Text>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="sm" fw={500}>
            CPF:
          </Text>
          <Text size="sm" c="dimmed">
            {cpf}
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="sm" fw={500}>
            RG:
          </Text>
          <Text size="sm" c="dimmed">
            {rg ? rg : 'Sem RG cadastrado'}
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="sm" fw={500}>
            Estado Civil:
          </Text>
          <Text size="sm" c="dimmed">
            {estado_civil ? estado_civil : 'Sem estado civil cadastrado'}
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="sm" fw={500}>
            Profissão:
          </Text>
          <Text size="sm" c="dimmed">
            {profissao ? profissao : 'Sem profissão cadastrada'}
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="sm" fw={500}>
            Data de Nascimento:
          </Text>
          <Text size="sm" c="dimmed">
            {dayjs(data_nascimento).format('DD/MM/YYYY')}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  )
}
