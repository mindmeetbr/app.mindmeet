import { createFileRoute } from '@tanstack/react-router'
import { Divider, Flex, Group, SimpleGrid, Skeleton, Text } from '@mantine/core'
import { PageLayout } from '../../../components/layout/PageLayout'
import {
  useDisponibilidadeCreate,
  useDisponibilidadeUpdate,
} from '../../../api/endpoints/disponibilidades/disponibilidades'
import { PapelEnum } from '../../../api/models'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { exigirPapel } from '../../../utils/auth'
import {
  salvarDisponibilidadeDia,
  useDisponibilidadesMerged,
} from './-useDisponibilidade'
import { CardDisponibilidade } from './-components/CardDisponibilidade'
import { BotaoAdicionarHorarios } from './-components/BotaoAdicionarHorarios'
import type { DisponibilidadeLocal } from './-types'

export const Route = createFileRoute('/app/disponibilidade/')({
  beforeLoad: exigirPapel(PapelEnum.PSICOLOGO),
  component: PaginaDisponibilidade,
})

function PaginaDisponibilidade() {
  useAlterarTitle('Disponibilidade')

  const { mutate: salvarDisponibilidade } = useDisponibilidadeCreate()
  const { mutate: atualizarDisponibilidade } = useDisponibilidadeUpdate()
  const { disponibilidades, idsDisponibilidades, idsHorarios, isLoading } =
    useDisponibilidadesMerged()

  const diasUteis = disponibilidades.slice(0, 5)
  const fimDeSemana = disponibilidades.slice(5)

  const handleSalvar = (dia: DisponibilidadeLocal): Promise<void> => {
    return new Promise((resolve, reject) => {
      salvarDisponibilidadeDia({
        dia,
        idsDisponibilidades,
        idsHorarios,
        salvarDisponibilidade: params =>
          salvarDisponibilidade(params, {
            onSuccess: resolve,
            onError: reject,
          }),
        atualizarDisponibilidade: params =>
          atualizarDisponibilidade(params, {
            onSuccess: resolve,
            onError: reject,
          }),
      })
    })
  }

  return (
    <PageLayout
      title="Disponibilidade"
      description="Configure sua disponibilidade semanal para atendimentos"
    >
      <Flex direction="column" gap="xl">
        <Group justify="flex-end">
          <BotaoAdicionarHorarios />
        </Group>

        {isLoading ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} height={60} radius="md" />
            ))}
          </SimpleGrid>
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {diasUteis.map(dia => (
                <CardDisponibilidade
                  key={dia.id}
                  dia={dia}
                  onSalvar={handleSalvar}
                />
              ))}
            </SimpleGrid>

            <Divider
              label={
                <Text size="sm" c="dimmed">
                  Fim de semana
                </Text>
              }
              labelPosition="center"
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {fimDeSemana.map(dia => (
                <CardDisponibilidade
                  key={dia.id}
                  dia={dia}
                  onSalvar={handleSalvar}
                />
              ))}
            </SimpleGrid>
          </>
        )}
      </Flex>
    </PageLayout>
  )
}
