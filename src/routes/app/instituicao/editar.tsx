import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  Card,
  Stack,
  Grid,
  TextInput,
  Select,
  Button,
  Group,
  rem,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { PageLayout } from '../../../components/layout'
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react'
import {
  useInstituicaoDetail,
  useInstituicaoUpdate,
} from '../../../api/endpoints/users/users'
import { notifications } from '@mantine/notifications'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'

export const Route = createFileRoute('/app/instituicao/editar')({
  component: EditarInstituicaoPage,
})

function EditarInstituicaoPage() {
  useAlterarTitle('Editar Instituição')
  const router = useRouter()
  const { data: instituicao, isSuccess } = useInstituicaoDetail()
  const { mutate: editarInstituicao } = useInstituicaoUpdate()

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
    if (isSuccess) {
      const { gestor, ...initialValues } = instituicao
      if (instituicao.endereco) {
        initialValues.endereco = instituicao.endereco
      } else {
        initialValues.endereco = {
          id: '',
          rua: '',
          numero: '',
          complemento: '',
          cep: '',
          cidade: '',
          uf: '',
        }
      }
      return initialValues
    }
  }

  const form = useForm({
    initialValues: getInitialValues(),
    validate: {
      nome: (value, values) => {
        if (!values.cnpj) return !value ? 'Nome é obrigatório' : null
      },
      cnpj: (value, values) => {
        if (!values.nome || value) {
          if (value.trim().length < 14 || value.trim().length > 18)
            return 'CNPJ inválido'
          else if (value.length === 18) {
            return /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(value)
              ? null
              : 'CNPJ inválido'
          } else if (value.length === 14) {
            return /\d{14}/.test(value) ? null : 'CNPJ inválido'
          }
          return 'CNPJ inválido'
        }
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    editarInstituicao(
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
        { label: 'Dashboard', href: '/app' },
        { label: 'Instituição', href: '/app/instituicao' },
        { label: 'Editar', isCurrentPage: true },
      ]}
      title="Editar Instituição"
      description="Atualize os dados da sua instituição, incluindo nome, CNPJ e endereço"
      secondaryAction={{
        label: 'Voltar',
        icon: <IconArrowLeft style={{ width: rem(16), height: rem(16) }} />,
        variant: 'subtle',
        onClick: () => router.navigate({ to: '/app/instituicao' }),
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          {/* Dados da Instituição */}
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Dados da Instituição</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Nome"
                    placeholder="Nome da Instituição"
                    required={!form.getValues().cnpj}
                    {...form.getInputProps('nome')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="CNPJ"
                    placeholder="00.000.000/0000-00"
                    required={!form.getValues().nome}
                    {...form.getInputProps('cnpj')}
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
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Rua"
                    placeholder="Nome da rua"
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
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Complemento"
                    placeholder="Apto, Sala..."
                    {...form.getInputProps('endereco.complemento')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="CEP"
                    placeholder="00000-000"
                    {...form.getInputProps('endereco.cep')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <TextInput
                    label="Cidade"
                    placeholder="Cidade"
                    {...form.getInputProps('endereco.cidade')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
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

          {/* Botões de Ação */}
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
              Salvar Alterações
            </Button>
          </Group>
        </Stack>
      </form>
    </PageLayout>
  )
}
