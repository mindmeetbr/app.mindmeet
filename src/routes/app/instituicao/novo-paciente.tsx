import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Select,
  Grid,
  rem,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react'
import { PageLayout } from '../../../components/layout'
import { usePacienteCreate } from '../../../api/endpoints/pacientes/pacientes'
import { notifications } from '@mantine/notifications'

export const Route = createFileRoute('/app/instituicao/novo-paciente')({
  component: NovoPaciente,
})

function NovoPaciente() {
  const { mutate: criarPaciente } = usePacienteCreate()
  const router = useRouter()

  const listaEstados = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ]

  const form = useForm({
    initialValues: {
      nome_completo: '',
      data_nascimento: '',
      email: '',
      numero_telefone: '',
      cpf: '',
      rg: '',
      estado_civil: '',
      profissao: '',
      endereco: {
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
      },
      contato_emergencia: {
        nome: '',
        numero_telefone: '',
        parentesco: '',
      },
    },
    validate: {
      nome_completo: value => (!value ? 'Nome é obrigatório' : null),
      email: value =>
        !value
          ? 'Email é obrigatório'
          : /^\S+@\S+$/.test(value)
            ? null
            : 'Email inválido',
      numero_telefone: value => (!value ? 'Telefone é obrigatório' : null),
      data_nascimento: value =>
        !value ? 'Data de nascimento é obrigatória' : null,
      cpf: value => (!value ? 'CPF é obrigatório' : null),
      contato_emergencia: {
        nome: value => (!value ? 'Nome do contato é obrigatório' : null),
        numero_telefone: value =>
          !value ? 'Telefone do contato é obrigatório' : null,
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    criarPaciente(
      { data: values },
      {
        onSuccess: () => {
          router.navigate({ to: '/app/instituicao' })
        },
        onError: () => {
          notifications.show({
            title: 'Erro',
            message: 'Não foi possível salvar o paciente, tente novamente.',
            color: 'red',
          })
        },
      }
    )
  }

  return (
    <PageLayout
      containerSize="lg"
      breadcrumbs={[
        { label: 'Instituição', href: '/app/instituicao' },
        { label: 'Novo Paciente', isCurrentPage: true },
      ]}
      title="Novo Paciente"
      description="Preencha as informações para cadastrar um novo paciente na instituição"
      secondaryAction={{
        label: 'Voltar',
        icon: <IconArrowLeft style={{ width: rem(16), height: rem(16) }} />,
        variant: 'subtle',
        onClick: () => router.navigate({ to: '/app/instituicao' }),
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          {/* Dados Pessoais */}
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Dados Pessoais</Title>

              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <TextInput
                    label="Nome Completo"
                    placeholder="Nome do paciente"
                    required
                    {...form.getInputProps('nome_completo')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Data de Nascimento"
                    type="date"
                    required
                    {...form.getInputProps('data_nascimento')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="email@exemplo.com"
                    required
                    {...form.getInputProps('email')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    required
                    {...form.getInputProps('numero_telefone')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="CPF"
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                    {...form.getInputProps('cpf')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="RG"
                    placeholder="00.000.000-0"
                    {...form.getInputProps('rg')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Select
                    label="Estado Civil"
                    placeholder="Selecione"
                    data={[
                      'Solteiro(a)',
                      'Casado(a)',
                      'Divorciado(a)',
                      'Viúvo(a)',
                      'União Estável',
                    ]}
                    {...form.getInputProps('estado_civil')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Profissão"
                    placeholder="Profissão do paciente"
                    {...form.getInputProps('profissao')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          {/* Contato de Emergência */}
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Contato de Emergência</Title>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Nome"
                    placeholder="Nome do contato"
                    required
                    {...form.getInputProps('contato_emergencia.nome')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    required
                    {...form.getInputProps(
                      'contato_emergencia.numero_telefone'
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Select
                    label="Parentesco"
                    placeholder="Selecione"
                    data={[
                      'Pai',
                      'Mãe',
                      'Cônjuge',
                      'Filho(a)',
                      'Irmão(ã)',
                      'Amigo(a)',
                      'Outro',
                    ]}
                    {...form.getInputProps('contato_emergencia.parentesco')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          {/* Endereço */}
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Endereço</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="CEP"
                    placeholder="00000-000"
                    {...form.getInputProps('endereco.cep')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Endereço"
                    placeholder="Rua, Avenida..."
                    {...form.getInputProps('endereco.endereco')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Número"
                    placeholder="123"
                    {...form.getInputProps('endereco.numero')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Complemento"
                    placeholder="Apto, Bloco..."
                    {...form.getInputProps('endereco.complemento')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Bairro"
                    placeholder="Nome do bairro"
                    {...form.getInputProps('endereco.bairro')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Cidade"
                    placeholder="Nome da cidade"
                    {...form.getInputProps('endereco.cidade')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 1 }}>
                  <Select
                    label="UF"
                    placeholder="SP"
                    data={listaEstados}
                    {...form.getInputProps('endereco.uf')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          {/* Botões */}
          <Group justify="flex-end" gap="md">
            <Button
              variant="outline"
              onClick={() => router.navigate({ to: '/app/instituicao' })}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              leftSection={
                <IconDeviceFloppy style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Cadastrar Paciente
            </Button>
          </Group>
        </Stack>
      </form>
    </PageLayout>
  )
}
