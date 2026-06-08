import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Table,
  Avatar,
  Text,
  Group,
  ActionIcon,
  rem,
  Flex,
  Badge,
} from '@mantine/core'
import {
  IconPlus,
  IconEye,
  IconEdit,
  IconPhone,
  IconMail,
} from '@tabler/icons-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import { PageLayout } from '../../../components/layout'
import { usePacienteList } from '../../../api/endpoints/pacientes/pacientes'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { usePaginacao } from '../../../hooks/usePaginacao'
import { PapelEnum, type Paciente } from '../../../api/models'
import { TabelaPaginada } from '../../../components/ui/TabelaPaginada'
import { exigirPapel } from '../../../utils/auth'
import { useUsuarioDetail } from '../../../api/endpoints/users/users'

export const Route = createFileRoute('/app/pacientes/')({
  beforeLoad: exigirPapel(PapelEnum.PSICOLOGO),
  component: PacientesPage,
})

const COLUNAS_PACIENTES = [
  { chave: 'paciente', label: 'Paciente' },
  { chave: 'contato', label: 'Contato' },
  { chave: 'idade', label: 'Idade' },
  { chave: 'queixa', label: 'Queixa Principal' },
  { chave: 'acoes', label: 'Ações', largura: 100 },
]

function TabelaPacientes() {
  const [searchTerm, setSearchTerm] = useState('')
  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao()

  const { data, isLoading, isError, refetch } = usePacienteList(
    { pagina, tamanho },
    { query: { queryKey: ['pacientes', pagina, tamanho] } }
  )

  const listaPacientes = data?.results ?? []
  const pacientesFiltrados = listaPacientes.filter(
    paciente =>
      paciente.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderLinhaPaciente = (paciente: Paciente) => (
    <Table.Tr key={paciente.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar>
            {paciente.nome_completo
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <div>
            <Group gap="sm">
              <Text fw={500} size="sm">
                {paciente.nome_completo}
              </Text>
              {paciente.acompanhado_por && (
                <Badge variant="outline" size="sm">
                  {paciente.acompanhado_por}
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              {paciente.cpf}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <div>
          <Group gap="xs">
            <IconPhone style={{ width: rem(12), height: rem(12) }} />
            <Text size="xs">{paciente.numero_telefone}</Text>
          </Group>
          <Group gap="xs">
            <IconMail style={{ width: rem(12), height: rem(12) }} />
            <Text size="xs">{paciente.email}</Text>
          </Group>
        </div>
      </Table.Td>
      <Table.Td>
        <Text size="sm">
          {dayjs().diff(dayjs(paciente.data_nascimento), 'year')} anos
        </Text>
      </Table.Td>
      <Table.Td>
        <Text lineClamp={2}>
          {paciente.informacoes_clinicas?.queixa_principal ?? 'Nenhuma'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Flex gap="xs">
          <Link to="/app/pacientes/$id" params={{ id: paciente.id }}>
            <ActionIcon variant="light" color="blue" size="sm">
              <IconEye style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
          <Link to="/app/pacientes/novo" search={{ id: paciente.id }}>
            <ActionIcon
              variant="light"
              color="orange"
              size="sm"
              disabled={!!paciente.acompanhado_por}
            >
              <IconEdit style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
        </Flex>
      </Table.Td>
    </Table.Tr>
  )

  return (
    <TabelaPaginada
      dados={pacientesFiltrados}
      total={data?.count ?? 0}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      colunas={COLUNAS_PACIENTES}
      renderLinha={renderLinhaPaciente}
      pagina={pagina}
      tamanho={tamanho}
      onPaginaChange={setPagina}
      onTamanhoChange={setTamanho}
      termoBusca={searchTerm}
      onBuscaChange={setSearchTerm}
      placeholderBusca="Buscar por nome ou email..."
      mensagemVazia="Nenhum paciente encontrado."
      mensagemErro="Não foi possível carregar seus pacientes. Tente novamente."
    />
  )
}

function PacientesPage() {
  useAlterarTitle('Seus Pacientes')
  const router = useRouter()
  const { data: dadosUsuario } = useUsuarioDetail({
    query: {
      queryKey: ['dados-usuario'],
      staleTime: 5 * 60 * 1000,
    },
  })

  const temVinculo = !!dadosUsuario?.vinculo

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Pacientes', isCurrentPage: true },
      ]}
      title="Pacientes"
      description="Gerencie o cadastro e acompanhe o histórico dos seus pacientes"
      primaryAction={
        temVinculo
          ? undefined
          : {
              label: 'Novo Paciente',
              icon: <IconPlus style={{ width: rem(16), height: rem(16) }} />,
              onClick: () => router.navigate({ to: '/app/pacientes/novo' }),
            }
      }
    >
      <TabelaPacientes />
    </PageLayout>
  )
}
