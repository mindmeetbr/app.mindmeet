import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Table,
  Avatar,
  Text,
  Group,
  ActionIcon,
  rem,
  Flex,
  Tabs,
  Button,
} from '@mantine/core'
import {
  IconPlus,
  IconUserCheck,
  IconUser,
  IconSettings,
  IconMail,
  IconPhone,
  IconEdit,
  IconEye,
} from '@tabler/icons-react'
import { useState } from 'react'
import { PageLayout } from '../../../components/layout'
import dayjs from 'dayjs'
import { usePacienteList } from '../../../api/endpoints/pacientes/pacientes'
import { useInstituicaoDetail } from '../../../api/endpoints/users/users'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { TabelaPaginada } from '../../../components/ui/TabelaPaginada'
import { usePaginacao } from '../../../hooks/usePaginacao'
import type { Paciente, PerfilPsicologo } from '../../../api/models'

export const Route = createFileRoute('/app/instituicao/')({
  component: PaginaInstituicao,
})

const generateId = () => crypto.randomUUID()

const enderecoPadrao = {
  id: generateId(),
  rua: 'Rua Exemplo',
  numero: '100',
  complemento: 'Sala 1',
  cep: '12345-678',
  cidade: 'São Paulo',
  uf: 'SP',
}

const psicologosMock: PerfilPsicologo[] = [
  {
    id: generateId(),
    usuario: {
      id: generateId(),
      nome_completo: 'Ana Paula Silva',
      email: 'ana.paula@mindmeet.com',
      cpf: '111.222.333-44',
      data_nascimento: '1985-02-10',
      numero_telefone: '(11) 91234-5678',
      sexo: 'F',
      verificado: true,
      endereco: enderecoPadrao,
    },
    crp: '00/12345',
    is_estagiario: false,
    supervisor: undefined,
    supervisor_confirmado: true,
  },
  {
    id: generateId(),
    usuario: {
      id: generateId(),
      nome_completo: 'Carlos Eduardo Lima',
      email: 'carlos.lima@mindmeet.com',
      cpf: '222.333.444-55',
      data_nascimento: '1980-07-21',
      numero_telefone: '(11) 98765-4321',
      sexo: 'M',
      verificado: true,
      endereco: enderecoPadrao,
    },
    crp: '00/67890',
    is_estagiario: false,
    supervisor: undefined,
    supervisor_confirmado: true,
  },
  {
    id: generateId(),
    usuario: {
      id: generateId(),
      nome_completo: 'Luciana Fernandes',
      email: 'luciana.fernandes@mindmeet.com',
      cpf: '333.444.555-66',
      data_nascimento: '1990-11-15',
      numero_telefone: '(11) 99876-5432',
      sexo: 'F',
      verificado: true,
      endereco: enderecoPadrao,
    },
    crp: '00/11223',
    is_estagiario: true,
    supervisor: 'carlos.lima@mindmeet.com',
    supervisor_confirmado: true,
  },
]

function TabelaPsicologos() {
  const [searchTerm, setSearchTerm] = useState('')
  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao()

  const psicologosFiltrados = psicologosMock.filter(
    psic =>
      psic.usuario?.nome_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      psic.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderLinhaPsicologo = (psicologo: PerfilPsicologo) => (
    <Table.Tr key={psicologo.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar>
            {psicologo.usuario?.nome_completo
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <Text fw={500} size="sm">
            {psicologo.usuario?.nome_completo}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>{psicologo.usuario?.email}</Table.Td>
      <Table.Td>{psicologo.crp}</Table.Td>
      <Table.Td>{psicologo.is_estagiario ? 'Sim' : 'Não'}</Table.Td>
      <Table.Td>{psicologo.supervisor ?? 'Nenhum'}</Table.Td>
      <Table.Td>
        <Flex gap="xs">
          <Link to="/psicologo/$id" params={{ id: psicologo.id }}>
            <ActionIcon variant="light" color="blue" size="sm" disabled={true}>
              <IconEye style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
          {/* TODO: Criar página para editar psicólogos quando se é gestor */}
          <Link to=".">
            <ActionIcon
              variant="light"
              color="orange"
              size="sm"
              disabled={true}
            >
              <IconEdit style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
        </Flex>
      </Table.Td>
    </Table.Tr>
  )

  const COLUNAS_PSICOLOGOS = [
    { chave: 'psicologo', label: 'Psicólogo' },
    { chave: 'email', label: 'Email' },
    { chave: 'crp', label: 'CRP' },
    { chave: 'isEstagiario', label: 'Estagiário' },
    { chave: 'supervisor', label: 'Supervisor' },
    { chave: 'acoes', label: 'Ações' },
  ]

  return (
    <TabelaPaginada
      dados={psicologosFiltrados}
      total={psicologosMock.length}
      isLoading={false}
      isError={false}
      onRetry={() => console.log('me implemente por favor')}
      colunas={COLUNAS_PSICOLOGOS}
      renderLinha={renderLinhaPsicologo}
      pagina={pagina}
      tamanho={tamanho}
      onPaginaChange={setPagina}
      onTamanhoChange={setTamanho}
      mensagemVazia="Nenhum psicólogo encontrado."
      mensagemErro="Não foi possível carregar seus psicólogos. Tente novamente"
      acoes={
        <Button
          component={Link}
          to="/app/instituicao/novo-psicologo"
          leftSection={<IconPlus />}
        >
          Adicionar Psicólogo
        </Button>
      }
      termoBusca={searchTerm}
      onBuscaChange={setSearchTerm}
    />
  )
}

function TabelaPacientes() {
  const [searchTerm, setSearchTerm] = useState('')
  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao()
  const { data, isLoading, isError, refetch } = usePacienteList(
    { pagina, tamanho },
    { query: { queryKey: ['pacientes', pagina, tamanho] } }
  )
  const listaPacientes = data?.results ?? []

  const calcularIdade = (dataNascimento?: string) =>
    dataNascimento ? dayjs().diff(dayjs(dataNascimento), 'year') : '-'

  const pacientesFiltrados = listaPacientes.filter(
    pac =>
      pac.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pac.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderLinhaPaciente = (paciente: Paciente) => (
    <Table.Tr key={paciente.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar>
            {paciente.nome_completo
              ?.split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <Text fw={500} size="sm">
            {paciente.nome_completo}
          </Text>
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
      <Table.Td>{calcularIdade(paciente.data_nascimento)} anos</Table.Td>
      <Table.Td>
        {paciente.informacoes_clinicas?.queixa_principal ?? 'Nenhuma'}
      </Table.Td>
      <Table.Td>
        <Flex gap="xs">
          <Link to="/app/pacientes/$id" params={{ id: paciente.id }}>
            <ActionIcon variant="light" color="blue" size="sm">
              <IconEye style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
          <Link to="/app/pacientes/novo" search={{ id: paciente.id }}>
            <ActionIcon variant="light" color="orange" size="sm">
              <IconEdit style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
        </Flex>
      </Table.Td>
    </Table.Tr>
  )

  const COLUNAS_PACIENTES = [
    { chave: 'paciente', label: 'Paciente' },
    { chave: 'contato', label: 'Contato' },
    { chave: 'idade', label: 'Idade' },
    { chave: 'queixa', label: 'Queixa Principal' },
    { chave: 'acoes', label: 'Ações', largura: 100 },
  ]

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
      acoes={
        <Button
          component={Link}
          to="/app/instituicao/novo-paciente"
          leftSection={<IconPlus />}
        >
          Adicionar Paciente
        </Button>
      }
    />
  )
}

function Gerenciamento() {
  return <p>oiiii</p>
}

function PaginaInstituicao() {
  const { data: instituicao } = useInstituicaoDetail()
  const router = useRouter()

  useAlterarTitle(instituicao?.nome ?? 'Instituição')
  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Instituição', isCurrentPage: true },
      ]}
      title={instituicao?.nome ?? 'Instituição'}
      description="Gerencie psicólogos e pacientes da instituição"
      primaryAction={{
        label: 'Editar',
        icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
        variant: 'light',
        onClick: () => router.navigate({ to: '/app/instituicao/editar' }),
      }}
    >
      <Tabs defaultValue="psicologos">
        <Tabs.List>
          <Tabs.Tab
            leftSection={<IconUserCheck size={18} />}
            value="psicologos"
          >
            Psicólogos
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconUser size={18} />} value="pacientes">
            Pacientes
          </Tabs.Tab>
          <Tabs.Tab
            leftSection={<IconSettings size={18} />}
            value="gerenciamento"
          >
            Gerenciamento
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="psicologos" pt="md">
          <TabelaPsicologos />
        </Tabs.Panel>

        <Tabs.Panel value="pacientes" pt="md">
          <TabelaPacientes />
        </Tabs.Panel>

        <Tabs.Panel value="gerenciamento" pt="md">
          <Gerenciamento />
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  )
}
