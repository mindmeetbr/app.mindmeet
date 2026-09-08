import {
  ActionIcon,
  Alert,
  Button,
  Flex,
  Group,
  Modal,
  rem,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconAlertCircle,
  IconEdit,
  IconEye,
  IconMail,
  IconPhone,
  IconPlus,
  IconUser,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
  useInstituicaoDetail,
  useListarPsicologos,
} from '../../../api/endpoints/instituicoes/instituicoes'
import {
  usePacienteList,
  useTrocarPsicologo,
} from '../../../api/endpoints/pacientes/pacientes'
import {
  type PacienteList,
  PapelEnum,
  type PerfilPsicologo,
} from '../../../api/models'
import { PageLayout } from '../../../components/layout'
import { TabelaPaginada } from '../../../components/ui/TabelaPaginada'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { usePaginacao } from '../../../hooks/usePaginacao'
import useAuthStore from '../../../stores/auth-store'
import { exigirPapel } from '../../../utils/auth'

export const Route = createFileRoute('/app/instituicao/')({
  beforeLoad: exigirPapel(PapelEnum.GESTOR),
  component: PaginaInstituicao,
})

const { user } = useAuthStore.getState()
const isGestor = user?.papel === PapelEnum.GESTOR

function TabelaPsicologos() {
  const [searchTerm, setSearchTerm] = useState('')
  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao()
  const { data, isLoading, isError, refetch } = useListarPsicologos(
    { pagina, tamanho },
    { query: { queryKey: ['psicologos', pagina, tamanho] } }
  )
  const listaPsicologos = data?.results ?? []

  const psicologosFiltrados = listaPsicologos.filter(
    psic =>
      psic.usuario?.nome_completo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      psic.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderLinhaPsicologo = (psicologo: PerfilPsicologo) => (
    <Table.Tr key={psicologo.id}>
      <Table.Td>
        <Text fw={500} size="sm">
          {psicologo.usuario?.nome_completo}
        </Text>
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
      total={data?.count ?? 0}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
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
          w="100%"
        >
          Adicionar Psicólogo
        </Button>
      }
      termoBusca={searchTerm}
      onBuscaChange={setSearchTerm}
    />
  )
}

interface ModalAtribuirPsicologoProps {
  paciente: PacienteList | null
  onClose: () => void
  onSucesso: () => void
}

function ModalAtribuirPsicologo({
  paciente,
  onClose,
  onSucesso,
}: ModalAtribuirPsicologoProps) {
  const [psicologoSelecionado, setPsicologoSelecionado] = useState<
    string | null
  >(null)
  const [psicologoInicial, setPsicologoInicial] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: psicologos, isLoading: carregandoPsicologos } =
    useListarPsicologos(
      { pagina: 1, tamanho: 999 },
      {
        query: {
          queryKey: ['psicologos-instituicao'],
        },
      }
    )

  const { mutate: trocarPsicologo, isPending } = useTrocarPsicologo({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['pacientes'] })
      },
    },
  })

  useEffect(() => {
    if (!paciente || !psicologos?.results) return

    const perfilAtual = psicologos.results.find(
      p => p.usuario?.id === paciente.psicologo_id
    )

    const valorInicial = perfilAtual?.id ?? null
    setPsicologoSelecionado(valorInicial)
    setPsicologoInicial(valorInicial)
  }, [paciente, psicologos])

  const houveAlteracao = psicologoSelecionado !== psicologoInicial

  const opcoesPsicologos =
    psicologos?.results?.map(p => ({
      value: p.id,
      label: `${p.usuario?.nome_completo} — CRP ${p.crp ?? 'não informado'}`,
    })) ?? []

  const handleSalvar = () => {
    if (!paciente || !houveAlteracao) return

    trocarPsicologo(
      { id: paciente.id, data: { novo_psicologo: psicologoSelecionado } },
      {
        onSuccess: () => {
          const foiRemocao = psicologoSelecionado === null

          notifications.show({
            title: foiRemocao ? 'Psicólogo removido' : 'Psicólogo atribuído',
            message: foiRemocao
              ? `${paciente.nome_completo} ficou sem psicólogo atribuído.`
              : `${paciente.nome_completo} foi transferido com sucesso.`,
            color: foiRemocao ? 'orange' : 'green',
          })
          onSucesso()
          onClose()
        },
        onError: () => {
          notifications.show({
            title: 'Erro ao atribuir',
            message: 'Verifique se o psicólogo pertence à sua instituição.',
            color: 'red',
          })
        },
      }
    )
  }

  const handleClose = () => {
    setPsicologoSelecionado(null)
    onClose()
  }

  return (
    <Modal
      opened={!!paciente}
      onClose={handleClose}
      title={
        <Text fw={600}>
          Atribuir psicólogo —{' '}
          <Text span c="dimmed" fw={400}>
            {paciente?.nome_completo}
          </Text>
        </Text>
      }
      centered
      size="md"
    >
      <Stack gap="lg">
        {paciente?.psicologo && (
          <Alert
            variant="light"
            color="orange"
            icon={<IconAlertCircle size={16} />}
          >
            Este paciente já é acompanhado por{' '}
            <Text span fw={500}>
              {paciente.psicologo}
            </Text>
            . Escolha outro psicólogo para transferir, ou limpe o campo para
            remover o vínculo.
          </Alert>
        )}

        <Select
          label="Psicólogo"
          description="Selecione o psicólogo que acompanhará este paciente"
          placeholder={
            carregandoPsicologos ? 'Carregando...' : 'Escolha um psicólogo'
          }
          data={opcoesPsicologos}
          value={psicologoSelecionado}
          onChange={setPsicologoSelecionado}
          searchable
          nothingFoundMessage="Nenhum psicólogo encontrado"
          disabled={carregandoPsicologos}
          clearable
        />

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" color="gray" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            loading={isPending}
            disabled={!houveAlteracao}
          >
            Salvar
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

function TabelaPacientes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [pacienteParaAtribuir, setPacienteParaAtribuir] =
    useState<PacienteList | null>(null)

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

  const renderLinhaPaciente = (paciente: PacienteList) => (
    <Table.Tr key={paciente.id}>
      <Table.Td>
        <Text fw={500} size="sm">
          {paciente.nome_completo}
        </Text>
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
      <Table.Td>{paciente.psicologo ?? 'Ninguém'}</Table.Td>
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
          {/* botão de atribuição — somente para gestores */}
          {isGestor && (
            <ActionIcon
              variant="light"
              color="green"
              size="sm"
              title="Atribuir psicólogo"
              onClick={() => setPacienteParaAtribuir(paciente)}
              // onClick={() => console.log(JSON.stringify(paciente, null, 4))}
            >
              <IconUserPlus style={{ width: rem(14), height: rem(14) }} />
            </ActionIcon>
          )}
        </Flex>
      </Table.Td>
    </Table.Tr>
  )

  const COLUNAS_PACIENTES = [
    { chave: 'paciente', label: 'Paciente' },
    { chave: 'contato', label: 'Contato' },
    { chave: 'idade', label: 'Idade' },
    { chave: 'psicologoPaciente', label: 'Psicólogo' },
    { chave: 'acoes', label: 'Ações', largura: isGestor ? 120 : 100 },
  ]

  return (
    <>
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
            w="100%"
          >
            Adicionar Paciente
          </Button>
        }
      />

      <ModalAtribuirPsicologo
        paciente={pacienteParaAtribuir}
        onClose={() => setPacienteParaAtribuir(null)}
        onSucesso={() => setPacienteParaAtribuir(null)}
      />
    </>
  )
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
        </Tabs.List>

        <Tabs.Panel value="psicologos" pt="md">
          <TabelaPsicologos />
        </Tabs.Panel>

        <Tabs.Panel value="pacientes" pt="md">
          <TabelaPacientes />
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  )
}
