import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  Button,
  Table,
  Avatar,
  Text,
  Group,
  Badge,
  ActionIcon,
  TextInput,
  Card,
  rem,
  Flex,
} from '@mantine/core'
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconPhone,
  IconMail,
} from '@tabler/icons-react'
import { useState } from 'react'
import dayjs from 'dayjs'
import { PageLayout } from '../../../components/layout'

export const Route = createFileRoute('/app/pacientes/')({
  component: PacientesPage,
})

const mockPacientes = [
  {
    id: 1,
    nome: 'Maria Silva Santos',
    email: 'maria.santos@email.com',
    telefone: '(11) 99999-1111',
    dataNascimento: '1985-03-15',
    cpf: '123.456.789-01',
    status: 'ativo',
    ultimaConsulta: '2024-01-25',
    proximaConsulta: '2024-02-08',
    avatar: null,
    queixaPrincipal: 'Ansiedade generalizada',
  },
  {
    id: 2,
    nome: 'João Pedro Costa',
    email: 'joao.costa@email.com',
    telefone: '(11) 99999-2222',
    dataNascimento: '1990-07-22',
    cpf: '987.654.321-02',
    status: 'ativo',
    ultimaConsulta: '2024-01-28',
    proximaConsulta: '2024-02-12',
    avatar: null,
    queixaPrincipal: 'Depressão e baixa autoestima',
  },
  {
    id: 3,
    nome: 'Ana Carolina Oliveira',
    email: 'ana.oliveira@email.com',
    telefone: '(11) 99999-3333',
    dataNascimento: '1978-11-08',
    cpf: '456.789.123-03',
    status: 'inativo',
    ultimaConsulta: '2023-12-15',
    proximaConsulta: null,
    avatar: null,
    queixaPrincipal: 'Problemas de relacionamento',
  },
  {
    id: 4,
    nome: 'Carlos Eduardo Mendes',
    email: 'carlos.mendes@email.com',
    telefone: '(11) 99999-4444',
    dataNascimento: '1992-05-30',
    cpf: '789.123.456-04',
    status: 'ativo',
    ultimaConsulta: '2024-01-30',
    proximaConsulta: '2024-02-15',
    avatar: null,
    queixaPrincipal: 'Síndrome do pânico',
  },
]

function PacientesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [pacientes, setPacientes] = useState(mockPacientes)

  const pacientesFiltrados = pacientes.filter(
    paciente =>
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calcularIdade = (dataNascimento: string) => {
    return dayjs().diff(dayjs(dataNascimento), 'year')
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
      setPacientes(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Pacientes', isCurrentPage: true }
      ]}
      title="Pacientes"
      description="Gerencie o cadastro e acompanhe o histórico dos seus pacientes"
      primaryAction={{
        label: 'Novo Paciente',
        icon: <IconPlus style={{ width: rem(16), height: rem(16) }} />,
        onClick: () => router.navigate({ to: '/app/pacientes/novo' })
      }}
    >

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
        </Group>

          <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Paciente</Table.Th>
                  <Table.Th>Contato</Table.Th>
                  <Table.Th>Idade</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Última Consulta</Table.Th>
                  <Table.Th>Próxima Consulta</Table.Th>
                  <Table.Th>Queixa Principal</Table.Th>
                  <Table.Th>Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {pacientesFiltrados.map(paciente => (
                  <Table.Tr key={paciente.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size="sm" radius="xl">
                          {paciente.nome
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)}
                        </Avatar>
                        <div>
                          <Text fw={500} size="sm">
                            {paciente.nome}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {paciente.cpf}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <div>
                        <Group gap="xs">
                          <IconPhone
                            style={{ width: rem(12), height: rem(12) }}
                          />
                          <Text size="xs">{paciente.telefone}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconMail
                            style={{ width: rem(12), height: rem(12) }}
                          />
                          <Text size="xs">{paciente.email}</Text>
                        </Group>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {calcularIdade(paciente.dataNascimento)} anos
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={paciente.status === 'ativo' ? 'green' : 'gray'}
                        variant="light"
                        size="sm"
                      >
                        {paciente.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {paciente.ultimaConsulta
                          ? dayjs(paciente.ultimaConsulta).format('DD/MM/YYYY')
                          : '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {paciente.proximaConsulta
                          ? dayjs(paciente.proximaConsulta).format('DD/MM/YYYY')
                          : '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {paciente.queixaPrincipal}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Flex gap="xs">
                        <Link
                          to="/app/pacientes/$id"
                          params={{ id: paciente.id.toString() }}
                        >
                          <ActionIcon variant="light" color="blue" size="sm">
                            <IconEye
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          </ActionIcon>
                        </Link>
                        <Link
                          to="/app/pacientes/novo"
                          search={{ id: paciente.id.toString() }}
                        >
                          <ActionIcon variant="light" color="orange" size="sm">
                            <IconEdit
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          </ActionIcon>
                        </Link>
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(paciente.id)}
                        >
                          <IconTrash
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        </ActionIcon>
                      </Flex>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {pacientesFiltrados.length === 0 && (
            <Text ta="center" py="xl" c="dimmed">
              Nenhum paciente encontrado
            </Text>
          )}
      </Card>
    </PageLayout>
  )
}
