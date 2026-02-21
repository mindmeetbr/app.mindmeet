import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Table,
  Avatar,
  Text,
  Group,
  ActionIcon,
  TextInput,
  Card,
  rem,
  Flex,
  Badge,
  Tabs,
  Button,
} from '@mantine/core'
import {
  IconSearch,
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
import { TableEmptyState } from '../../../components/ui/TableEmptyState'

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

const psicologosMock = [
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
    supervisor: null,
    supervisor_verificado: true,
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
    supervisor: null,
    supervisor_verificado: true,
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
    supervisor_verificado: true,
  },
]

function TabelaPsicologos() {
  const [searchTerm, setSearchTerm] = useState('')

  const psicologosFiltrados = psicologosMock.filter(
    psic =>
      psic.usuario.nome_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      psic.usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const linhasTabelaPsicologo = psicologosFiltrados.map(psic => (
    <Table.Tr key={psic.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar>
            {psic.usuario.nome_completo
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
          <Text fw={500} size="sm">
            {psic.usuario.nome_completo}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>{psic.usuario.email}</Table.Td>
      <Table.Td>{psic.crp}</Table.Td>
      <Table.Td>{psic.is_estagiario ? 'Sim' : 'Não'}</Table.Td>
      <Table.Td>{psic.supervisor ?? 'Nenhum'}</Table.Td>
      <Table.Td>
        <Flex gap="xs">
          <Link to="/psicologo/$id" params={{ id: psic.id }}>
            <ActionIcon variant="light" color="blue" size="sm" disabled={true}>
              <IconEye style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
          {/* TODO: Criar página para editar psicólogos quando se é gestor */}
          <Link to="#">
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
  ))

  return (
    <Card withBorder radius="md" p="md">
      <Group mb="md">
        <TextInput
          placeholder="Buscar por nome ou email..."
          leftSection={
            <IconSearch style={{ width: rem(16), height: rem(16) }} />
          }
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button
          component={Link}
          to="/app/instituicao/novo-psicologo"
          leftSection={<IconPlus />}
        >
          Adicionar Psicólogo
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Psicólogo</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>CRP</Table.Th>
              <Table.Th>Estagiário</Table.Th>
              <Table.Th>Supervisor</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <TableEmptyState
              isError={false}
              isLoading={false}
              isEmpty={psicologosFiltrados.length === 0}
              onRetry={() => console.log('me implementa por favor')}
              emptyMessage="Nenhum psicólogo encontrado."
              errorMessage="Não foi possível carregar seus psicólogos. Tente novamente"
              colSpan={6}
            />
            {linhasTabelaPsicologo}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Badge mt="sm">{`Total: ${psicologosFiltrados.length}`}</Badge>
    </Card>
  )
}

function TabelaPacientes() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: pacientes, isLoading, isError, refetch } = usePacienteList()
  const listaPacientes = pacientes ?? []

  const calcularIdade = (dataNascimento?: string) =>
    dataNascimento ? dayjs().diff(dayjs(dataNascimento), 'year') : '-'

  const pacientesFiltrados = listaPacientes.filter(
    pac =>
      pac.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pac.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const linhasTabelaPacientes = pacientesFiltrados.map(paciente => (
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
  ))

  return (
    <Card withBorder radius="md" p="md">
      <Group mb="md">
        <TextInput
          placeholder="Buscar por nome ou email..."
          leftSection={
            <IconSearch style={{ width: rem(16), height: rem(16) }} />
          }
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button
          component={Link}
          to="/app/instituicao/novo-paciente"
          leftSection={<IconPlus />}
        >
          Adicionar Paciente
        </Button>
      </Group>

      <Table.ScrollContainer minWidth={800}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Paciente</Table.Th>
              <Table.Th>Contato</Table.Th>
              <Table.Th>Idade</Table.Th>
              <Table.Th>Queixa Principal</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <TableEmptyState
              isError={isError}
              isLoading={isLoading}
              isEmpty={
                !isError && !isLoading && pacientesFiltrados.length === 0
              }
              onRetry={refetch}
              colSpan={5}
              errorMessage="Não foi possível carregar seus pacientes. Tente novamente."
              emptyMessage="Nenhum paciente encontrado."
            />
            {!isLoading && isError && linhasTabelaPacientes}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Badge mt="sm">{`Total: ${pacientesFiltrados.length}`}</Badge>
    </Card>
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
