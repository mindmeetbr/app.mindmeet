import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Title,
  Card,
  Group,
  Text,
  Avatar,
  rem,
  Tabs,
  Skeleton,
  Alert,
  Button,
} from '@mantine/core'
import {
  IconEdit,
  IconCalendar,
  IconUser,
  IconAlertCircle,
  IconRefresh,
} from '@tabler/icons-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { PageLayout } from '../../../components/layout'
import { usePacienteDetail } from '../../../api/endpoints/pacientes/pacientes'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { LinhaDoTempo as ComponenteLinhaDoTempo } from './-components/LinhaDoTempo'
import { BotaoNovaConsulta } from './-components/BotaoNovaConsulta'
import { PerfilPaciente } from './-components/PerfilPaciente'

export const Route = createFileRoute('/app/pacientes/$id')({
  component: PacienteDetalhePage,
})

const calcularIdade = (dataNascimento: string) => {
  return dayjs().diff(dayjs(dataNascimento), 'year')
}

function PacienteDetalhePage() {
  const { id } = Route.useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string | null>('perfil')
  const {
    data: paciente,
    isLoading,
    isError,
    refetch,
    error,
  } = usePacienteDetail(id)

  const titulo = paciente?.nome_completo
    ? `Paciente: ${paciente.nome_completo}`
    : 'Paciente'
  useAlterarTitle(titulo)

  if (isLoading) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: 'Pacientes', href: '/app/pacientes' },
          { label: '...', isCurrentPage: true },
        ]}
        title=""
        headerChildren={
          <Group gap="md" mt="xs">
            <Skeleton height={60} width={60} radius="md" />
            <Group gap="md">
              <Skeleton height={16} width={60} />
              <Skeleton height={16} width={100} />
            </Group>
          </Group>
        }
      >
        <Skeleton height={40} mb="md" />
        <Skeleton height={300} />
      </PageLayout>
    )
  }

  if (isError || !paciente) {
    const status = error?.response?.status

    const mensagens: Record<number, string> = {
      403: 'Você não tem permissão para acessar este paciente.',
      404: 'Este paciente não foi encontrado.',
    }

    const descricao = status
      ? (mensagens[status] ?? 'Ocorreu um erro inesperado.')
      : 'Não foi possível conectar ao servidor.'

    return (
      <PageLayout
        breadcrumbs={[
          { label: 'Pacientes', href: '/app/pacientes' },
          { label: 'Erro', isCurrentPage: true },
        ]}
        title="Paciente não encontrado"
      >
        <Alert
          icon={<IconAlertCircle size={16} />}
          title={
            status
              ? `Erro ${status} — Não foi possível carregar o paciente`
              : 'Erro — Não foi possível carregar o paciente'
          }
          color="red"
          variant="light"
        >
          {descricao}
        </Alert>
        <Button
          mt="md"
          variant="light"
          color="red"
          leftSection={<IconRefresh size={16} />}
          onClick={() => refetch()}
        >
          Tentar novamente
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Pacientes', href: '/app/pacientes' },
        { label: paciente.nome_completo, isCurrentPage: true },
      ]}
      title={paciente.nome_completo}
      primaryAction={
        // se existe acompanhado -> supervisor que está olhando
        paciente.acompanhado_por
          ? undefined
          : {
              label: 'Editar',
              icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
              variant: 'light',
              onClick: () =>
                router.navigate({ to: '/app/pacientes/novo', search: { id } }),
            }
      }
      headerChildren={
        <Group gap="md" mt="xs">
          <Avatar size={60} radius="md">
            {paciente.nome_completo
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <Group gap="md">
            <Text size="sm" c="dimmed">
              {calcularIdade(paciente.data_nascimento)} anos
            </Text>
            <Text size="sm" c="dimmed">
              CPF: {paciente.cpf}
            </Text>
          </Group>
        </Group>
      }
    >
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab
            value="perfil"
            leftSection={
              <IconUser style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Perfil
          </Tabs.Tab>
          <Tabs.Tab
            value="consultas"
            leftSection={
              <IconCalendar style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Consultas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="perfil" pt="lg">
          <PerfilPaciente paciente={paciente} />
        </Tabs.Panel>

        <Tabs.Panel value="consultas" pt="lg">
          <Card withBorder radius="md" p="xl">
            <Group justify="space-between" mb="lg">
              <Title order={4}>Linha do Tempo das Consultas</Title>
              <BotaoNovaConsulta
                pacienteId={id}
                desativado={!!paciente?.acompanhado_por}
              />
            </Group>

            <ComponenteLinhaDoTempo
              pacienteId={id}
              podeEditar={!paciente?.acompanhado_por}
            />
          </Card>
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  )
}
