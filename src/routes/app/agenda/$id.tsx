import { createFileRoute, useRouter } from '@tanstack/react-router'

import { PageLayout } from '../../../components/layout'
import {
  Card,
  SimpleGrid,
  Stack,
  Text,
  Divider,
  rem,
  Group,
  Title,
  LoadingOverlay,
  Center,
  Alert,
} from '@mantine/core'
import { IconAlertCircle, IconEdit } from '@tabler/icons-react'
import { EstadoEnum } from '../../../api/models'
import {
  getEstadoBadge,
  getTipoBadge,
  formatarDataHora,
  formatarData,
  formatarHora,
} from '../../../utils/agenda'
import { useAgendamentoDetail } from '../../../api/endpoints/agendamentos/agendamentos'

export const Route = createFileRoute('/app/agenda/$id')({
  component: AgendamentoDetalhePage,
})

function InfoItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Group gap="xs">
      <Text fw={600} size="sm">
        {label}:
      </Text>
      <Text size="sm">{children}</Text>
    </Group>
  )
}

function AgendamentoDetalhePage() {
  const router = useRouter()
  const { id } = Route.useParams()
  const { data: agendamento, isLoading, isError } = useAgendamentoDetail(id)

  if (isLoading) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: 'Agenda', href: '/app/agenda' },
          {
            label: 'Agendamento com Paciente',
            isCurrentPage: true,
          },
        ]}
        title="Agendamento"
      >
        <LoadingOverlay visible overlayProps={{ blur: 2 }} />
      </PageLayout>
    )
  }

  if (isError || agendamento === undefined) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: 'Dashboard', href: '/app' },
          {
            label: 'Agendamento com Paciente',
            isCurrentPage: true,
          },
        ]}
        title="Agendamento"
        description="Gerencie seus agendamentos e consultas"
      >
        <Center mt="xl">
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Erro ao carregar dados"
            color="red"
            variant="filled"
          >
            Não foi possível carregar o agendamento. Tente novamente mais tarde.
          </Alert>
        </Center>
      </PageLayout>
    )
  }

  const tituloLayout = `Agendamento com ${agendamento.paciente.nome_completo} (${formatarDataHora(
    agendamento.data,
    agendamento.horario_inicio
  )})`

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Agenda', href: '/app/agenda' },
        {
          label: `Agendamento com ${agendamento.paciente.nome_completo}`,
          isCurrentPage: true,
        },
      ]}
      title={tituloLayout}
      primaryAction={{
        label: 'Editar',
        icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
        variant: 'light',
        onClick: () =>
          router.navigate({ to: '/app/agenda/novo', search: { id } }),
      }}
    >
      <Stack gap="lg">
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card withBorder p="xl" radius="md">
            <Stack gap="md">
              <Title order={4}>Informações do Paciente</Title>
              <Divider />
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                <InfoItem label="Nome">
                  {agendamento.paciente.nome_completo}
                </InfoItem>
                <InfoItem label="Email">{agendamento.paciente.email}</InfoItem>
                <InfoItem label="Telefone">
                  {agendamento.paciente.numero_telefone ?? 'Sem telefone'}
                </InfoItem>
              </SimpleGrid>
            </Stack>
          </Card>
          <Card withBorder p="xl" radius="md">
            <Stack gap="md">
              <Title order={4}>Informações Gerais</Title>
              <Divider />
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                <InfoItem label="Data">
                  {formatarData(agendamento.data)}
                </InfoItem>
                <InfoItem label="Início">
                  {formatarHora(agendamento.horario_inicio)}
                </InfoItem>
                <InfoItem label="Fim">
                  {formatarHora(agendamento.horario_fim)}
                </InfoItem>
                <InfoItem label="Tipo">
                  {getTipoBadge(agendamento.tipo)}
                </InfoItem>
                <InfoItem label="Estado">
                  {agendamento.estado
                    ? getEstadoBadge(agendamento.estado)
                    : 'Desconhecido'}
                </InfoItem>
                {agendamento.estado === EstadoEnum.cancelado && (
                  <InfoItem label="Motivo do Cancelamento">
                    {agendamento.motivo_cancelamento ?? 'Não informado'}
                  </InfoItem>
                )}
              </SimpleGrid>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </PageLayout>
  )
}
