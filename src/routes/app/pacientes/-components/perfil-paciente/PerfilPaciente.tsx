import type { Paciente } from '../../../../../api/models'
import { Grid } from '@mantine/core'
import CardDadosPessoais from './CardDadosPessoais'
import CardContato from './CardContato'
import CardInformacoesClinicas from './CardInformacoesClinicas'
import CardContatoEmergencia from './CardContatoEmergencia'
import CardEndereco from './CardEndereco'

export function PerfilPaciente({ paciente }: { paciente: Paciente }) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <CardDadosPessoais {...paciente} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <CardContato {...paciente} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <CardInformacoesClinicas {...paciente} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <CardContatoEmergencia {...paciente} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <CardEndereco {...paciente} />
      </Grid.Col>
    </Grid>
  )
}
