import { Flex, rem } from '@mantine/core'
import { IconCalendarWeek, IconClock } from '@tabler/icons-react'
import dayjs from 'dayjs'
import type { Agenda } from '../../../../api/models'
import { CardEstatistica } from './CardEstatistica'

interface CardAgendaProps {
  dados: Agenda
}

export function CardAgenda({ dados }: CardAgendaProps) {
  const stringInicio = dayjs(dados.proxima_semana.periodo.inicio).format(
    'DD/MM/YYYY'
  )
  const stringFim = dayjs(dados.proxima_semana.periodo.fim).format('DD/MM/YYYY')
  const stringPeriodo = `${stringInicio} a ${stringFim}`

  return (
    <Flex
      gap="md"
      align="stretch"
      direction={{ base: 'column', sm: 'row' }}
      wrap={{ base: 'wrap', sm: 'nowrap' }}
    >
      <CardEstatistica
        label="Agendamentos hoje"
        value={dados.hoje.total}
        icon={<IconClock style={{ width: rem(24), height: rem(24) }} />}
        color={dados.hoje.total > 0 ? 'blue' : 'gray'}
        description={
          dados.hoje.proximo_horario
            ? `Próximo às ${dados.hoje.proximo_horario}`
            : dados.hoje.total === 0
              ? 'Nenhum agendamento hoje'
              : undefined
        }
      />

      <CardEstatistica
        label="Próxima semana"
        value={dados.proxima_semana.total}
        description={stringPeriodo}
        color="grape"
        icon={<IconCalendarWeek style={{ width: rem(24), height: rem(24) }} />}
      />
    </Flex>
  )
}
