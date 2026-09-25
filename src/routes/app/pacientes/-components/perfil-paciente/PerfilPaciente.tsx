import { Grid } from '@mantine/core'
import type { Paciente } from '../../../../../api/models'
import CardAnamnese from './CardAnamnese'
import CardContato from './CardContato'
import CardContatoEmergencia from './CardContatoEmergencia'
import CardDadosPessoais from './CardDadosPessoais'
import CardEndereco from './CardEndereco'
import CardInformacoesClinicas from './CardInformacoesClinicas'

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
      <Grid.Col span={{ base: 12, md: 6 }}>
        <CardAnamnese {...paciente} />
      </Grid.Col>
    </Grid>
  )
}
