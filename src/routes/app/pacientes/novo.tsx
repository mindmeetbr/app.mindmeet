import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import {
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  Grid,
  rem,
  // Divider,
  Title,
} from '@mantine/core'
// import { notifications } from '@mantine/notifications'
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { PageLayout } from '../../../components/layout'
import {
  usePacienteCreate,
  usePacienteUpdate,
  usePacienteDetail,
} from '../../../api/endpoints/pacientes/pacientes'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'

export const Route = createFileRoute('/app/pacientes/novo')({
  component: NovoPacientePage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
  }),
})

function NovoPacientePage() {
  const router = useRouter()
  const search = useSearch({ from: '/app/pacientes/novo' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!search.id
  const pacienteId = search.id
  useAlterarTitle(isEditing ? 'Editar Paciente' : 'Novo Paciente')

  const { mutate: criarPaciente } = usePacienteCreate()
  const { mutate: editarPaciente } = usePacienteUpdate()
  const { data: paciente, isSuccess } = usePacienteDetail(pacienteId as string)

  useEffect(() => {
    if (paciente?.acompanhado_por) {
      router.navigate({
        to: '/app/pacientes/$id',
        params: { id: pacienteId as string },
      })
    }
  }, [paciente, router, pacienteId])

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

  const getInitialValues = () => {
    const defaultValues = {
      nome_completo: '',
      email: '',
      numero_telefone: '',
      numero_celular: '',
      data_nascimento: '',
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

      informacoes_clinicas: {
        queixa_principal: '',
        historico_psiquiatrico: '',
        medicamentos_atuais: '',
        alergias: '',
      },

      contato_emergencia: {
        nome: '',
        numero_telefone: '',
        parentesco: '',
      },

      anamnese: {
        motivo_consulta: '',
        expectativas: '',
        historia_doenca_atual: '',
        historico_familiar: '',
        aspectos_observados: '',
        uso_substancias: '',
        observacoes: '',
      },
    }

    if (isEditing && pacienteId && isSuccess && paciente) {
      return paciente
    }

    return defaultValues
  }

  const form = useForm({
    initialValues: getInitialValues(),
    validate: {
      nome_completo: (value: string) => (!value ? 'Nome é obrigatório' : null),
      email: (value: string) =>
        !value
          ? 'Email é obrigatório'
          : /^\S+@\S+$/.test(value)
            ? null
            : 'Email inválido',
      numero_telefone: (value: string) =>
        !value ? 'Telefone é obrigatório' : null,
      data_nascimento: (value: string) =>
        !value ? 'Data de nascimento é obrigatória' : null,
      cpf: (value: string) => (!value ? 'CPF é obrigatório' : null),
      contato_emergencia: {
        nome: value => (!value ? 'Nome do contato é obrigatório' : null),
        numero_telefone: value =>
          !value ? 'Telefone do contato é obrigatório' : null,
      },
    },
  })

  const setError = (error: any) => {
    const errosBackend = error?.response.data
    if (errosBackend) {
      form.setErrors(errosBackend)
    }
  }

  const handleSubmit = (values: typeof form.values) => {
    setIsSubmitting(true)
    try {
      if (isEditing) {
        editarPaciente(
          { idPaciente: pacienteId!, data: values },
          {
            onSuccess: () => {
              router.navigate({
                to: '/app/pacientes/$id',
                params: { id: pacienteId! },
              })
            },
            onError: (error: any) => {
              setError(error)

              // notifications.show({
              //   title: 'Erro',
              //   message:
              //     'Não foi possível salvar as alterações, tente novamente.',
              //   color: 'red',
              // })
            },
          }
        )
      } else {
        criarPaciente(
          { data: values },
          {
            onSuccess: () => {
              router.navigate({ to: '/app/pacientes' })
            },
            onError: (error: any) => {
              setError(error)
              // notifications.show({
              //   title: 'Erro',
              //   message: 'Não foi possível salvar o paciente, tente novamente.',
              //   color: 'red',
              // })
            },
          }
        )
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPacienteName = () => {
    if (isEditing && pacienteId && isSuccess && paciente) {
      return paciente.nome_completo
    }
    return ''
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: 'Pacientes', href: '/app/pacientes' }]

    if (isEditing) {
      breadcrumbs.push({
        label: getPacienteName(),
        onClick: () =>
          router.navigate({
            to: '/app/pacientes/$id',
            params: { id: pacienteId! },
          }),
      })
    }

    breadcrumbs.push({
      label: isEditing ? 'Editar' : 'Novo Paciente',
      isCurrentPage: true,
    })

    return breadcrumbs
  }

  return (
    <PageLayout
      containerSize="lg"
      breadcrumbs={getBreadcrumbs()}
      title={isEditing ? `Editando: ${getPacienteName()}` : 'Novo Paciente'}
      description={
        isEditing
          ? 'Atualize as informações do paciente abaixo'
          : 'Preencha as informações para cadastrar um novo paciente'
      }
      secondaryAction={{
        label: 'Voltar',
        icon: <IconArrowLeft style={{ width: rem(16), height: rem(16) }} />,
        variant: 'subtle',
        onClick: () =>
          isEditing
            ? router.navigate({
                to: '/app/pacientes/$id',
                params: { id: pacienteId! },
              })
            : router.navigate({ to: '/app/pacientes' }),
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
                    label="Celular"
                    placeholder="(11) 99999-9999"
                    {...form.getInputProps('numero_celular')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
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

                <Grid.Col span={12}>
                  <TextInput
                    label="Profissão"
                    placeholder="Profissão do paciente"
                    {...form.getInputProps('profissao')}
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
                    label="Rua"
                    placeholder="Rua, Avenida..."
                    {...form.getInputProps('endereco.rua')}
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

          {/* Informações Clínicas */}
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Informações Clínicas</Title>
              <Textarea
                label="Queixa Principal"
                placeholder="Descreva a queixa principal do paciente..."
                rows={3}
                {...form.getInputProps('informacoes_clinicas.queixa_principal')}
              />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="Histórico Psiquiátrico"
                    placeholder="Histórico de tratamentos anteriores..."
                    rows={3}
                    {...form.getInputProps(
                      'informacoes_clinicas.historico_psiquiatrico'
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="Medicamentos Atuais"
                    placeholder="Medicamentos em uso..."
                    rows={3}
                    {...form.getInputProps(
                      'informacoes_clinicas.medicamentos_atuais'
                    )}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Alergias"
                placeholder="Alergias conhecidas..."
                {...form.getInputProps('informacoes_clinicas.alergias')}
              />
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
                    withAsterisk
                    {...form.getInputProps('contato_emergencia.nome')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Telefone"
                    placeholder="(11) 99999-9999"
                    required
                    withAsterisk
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

          {/* Anamnese */}
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Anamnese</Title>

              <Textarea
                label="Motivo da Consulta"
                placeholder="Por que o paciente procurou ajuda psicológica?"
                rows={3}
                {...form.getInputProps('anamnese.motivo_consulta')}
              />

              <Textarea
                label="Expectativas"
                placeholder="O que o paciente espera do tratamento?"
                rows={2}
                {...form.getInputProps('anamnese.expectativas')}
              />

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="História da Doença Atual"
                    placeholder="Como iniciaram os sintomas..."
                    rows={4}
                    {...form.getInputProps('anamnese.historia_doenca_atual')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="Histórico Familiar"
                    placeholder="Histórico de doenças mentais na família..."
                    rows={4}
                    {...form.getInputProps('anamnese.historico_familiar')}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="Aspectos a serem observados"
                    placeholder="Tratamentos anteriores, internações..."
                    rows={3}
                    {...form.getInputProps('anamnese.aspectos_observados')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Textarea
                    label="Uso de Substâncias"
                    placeholder="Álcool, drogas, tabaco..."
                    rows={3}
                    {...form.getInputProps('anamnese.uso_substancias')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          {/* Observações */}
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Observações Gerais</Title>

              <Textarea
                label="Observações"
                placeholder="Outras informações relevantes..."
                rows={4}
                {...form.getInputProps('anamnese.observacoes')}
              />
            </Stack>
          </Card>

          {/* Botões de Ação */}
          <Group justify="flex-end" gap="md">
            <Button
              variant="outline"
              onClick={() =>
                isEditing
                  ? router.navigate({
                      to: '/app/pacientes/$id',
                      params: { id: pacienteId! },
                    })
                  : router.navigate({ to: '/app/pacientes' })
              }
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              leftSection={
                <IconDeviceFloppy style={{ width: rem(16), height: rem(16) }} />
              }
              loading={isSubmitting}
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
            </Button>
          </Group>
        </Stack>
      </form>
    </PageLayout>
  )
}
