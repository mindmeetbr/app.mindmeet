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
import {
  usePacienteList,
  usePacienteDelete,
} from '../../../api/endpoints/api/api'
import { notifications } from '@mantine/notifications'

export const Route = createFileRoute('/app/pacientes/')({
  component: PacientesPage,
})

function TabelaPacientes() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading, isError } = usePacienteList()
  const { mutate: apagarPaciente } = usePacienteDelete()

  const calcularIdade = (dataNascimento: string) => {
    return dayjs().diff(dayjs(dataNascimento), 'year')
  }

  const handleClick = (idPaciente: string) => {
    const apagar = window.confirm(
      'Tem certeza que deseja apagar este paciente?'
    )

    if (apagar) {
      apagarPaciente(
        { idPaciente },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Sucesso',
              message: 'Paciente apagado com sucesso.',
              color: 'green',
            })
          },
          onError: () => {
            notifications.show({
              title: 'Erro',
              message: 'Não foi possível apagar o paciente, tente novamente.',
              color: 'red',
            })
          },
        }
      )
    }
  }

  if (isLoading) {
    return <p>Carregando pacientes...</p>
  }

  if (isError) {
    return <p>Não foi possível carregar seus pacientes, tente novamente.</p>
  }

  if (data?.length === 0) {
    return <p>Nenhum paciente cadastrado.</p>
  }

  const pacientesFiltrados = data!.filter(
    paciente =>
      paciente.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const linhasTabela = pacientesFiltrados.map(paciente => (
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
            <Text fw={500} size="sm">
              {paciente.nome_completo}
            </Text>
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
        <Text size="sm">{calcularIdade(paciente.data_nascimento)} anos</Text>
      </Table.Td>
      <Table.Td>
        <Text lineClamp={2}>
          {paciente.informacoes_clinicas?.queixa_principal
            ? paciente.informacoes_clinicas.queixa_principal
            : 'Nenhuma'}
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
            <ActionIcon variant="light" color="orange" size="sm">
              <IconEdit style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          </Link>
          <ActionIcon
            variant="light"
            color="red"
            size="sm"
            onClick={() => handleClick(paciente.id)}
          >
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          </ActionIcon>
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
          <Table.Tbody>{linhasTabela}</Table.Tbody>
        </Table>

        {pacientesFiltrados.length === 0 && (
          <Text ta="center" py="xl" c="dimmed">
            Nenhum paciente encontrado
          </Text>
        )}
      </Table.ScrollContainer>
    </Card>
  )
}

function PacientesPage() {
  const router = useRouter()

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Pacientes', isCurrentPage: true },
      ]}
      title="Pacientes"
      description="Gerencie o cadastro e acompanhe o histórico dos seus pacientes"
      primaryAction={{
        label: 'Novo Paciente',
        icon: <IconPlus style={{ width: rem(16), height: rem(16) }} />,
        onClick: () => router.navigate({ to: '/app/pacientes/novo' }),
      }}
    >
      <TabelaPacientes />
    </PageLayout>
  )
}
