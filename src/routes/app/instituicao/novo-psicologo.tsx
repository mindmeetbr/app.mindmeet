import { createFileRoute, useRouter } from '@tanstack/react-router'

import {
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  Select,
  Title,
  rem,
  Checkbox,
  Grid,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { PageLayout } from '../../../components/layout'
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
export const Route = createFileRoute('/app/instituicao/novo-psicologo')({
  component: NovoPsicologo,
})

function NovoPsicologo() {
  useAlterarTitle('Cadastrar Psicólogo')
  const router = useRouter()

  const form = useForm({
    initialValues: {
      nome_completo: '',
      data_nascimento: '',
      email: '',
      numero_telefone: '',
      crp: '',
      is_estagiario: false,
      supervisor: '',
    },
    validate: {
      nome_completo: value => (!value ? 'Informe o nome completo' : null),
      email: value => (!value ? 'Informe o e-mail' : null),
      numero_telefone: value => (!value ? 'Informe o telefone' : null),
      supervisor: (value, values) =>
        values.is_estagiario && !value ? 'Informe o supervisor' : null,
      data_nascimento: value => {
        if (!value) return 'Data de nascimento é obrigatória'
        if (dayjs(value).isAfter(dayjs()))
          return 'A data não pode estar no futuro'
        return null
      },
      crp: (value, values) => {
        if (!values.is_estagiario) {
          return /^\d{2}\/\d{5}$/.test(value)
            ? null
            : 'CRP inválido. Use o formato 00/00000'
        }
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    // TODO: integrar com a API
    console.log(JSON.stringify(values, null, 2))
    // router.navigate({ to: '/app/instituicao' })
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Psicólogos', href: '/app/psicologos' },
        { label: 'Novo Psicólogo', isCurrentPage: true },
      ]}
      title="Novo Psicólogo"
      description="Cadastre um novo psicólogo vinculado à instituição"
      secondaryAction={{
        label: 'Voltar',
        icon: <IconArrowLeft style={{ width: rem(16), height: rem(16) }} />,
        variant: 'subtle',
        onClick: () => router.navigate({ to: '/app/instituicao' }),
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Informações Pessoais</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Nome completo"
                    placeholder="Digite o nome completo"
                    required
                    withAsterisk
                    {...form.getInputProps('nome_completo')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Data de Nascimento"
                    type="date"
                    required
                    withAsterisk
                    {...form.getInputProps('data_nascimento')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="E-mail"
                    placeholder="Digite o e-mail"
                    {...form.getInputProps('email')}
                    required
                    withAsterisk
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    required
                    withAsterisk
                    {...form.getInputProps('numero_telefone')}
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>

          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Title order={4}>Informações Profissionais</Title>

              <Checkbox
                label="É estagiário?"
                {...form.getInputProps('is_estagiario', {
                  type: 'checkbox',
                })}
              />
              <Group grow>
                <TextInput
                  label="CRP"
                  placeholder="Informe o número do CRP"
                  {...form.getInputProps('crp')}
                  disabled={form.values.is_estagiario}
                  required={!form.values.is_estagiario}
                />

                <Select
                  label="Supervisor"
                  placeholder="Selecione o supervisor"
                  data={[
                    { value: '1', label: 'Dra. Ana Souza' },
                    { value: '2', label: 'Dr. Carlos Pereira' },
                    { value: '3', label: 'Dra. Mariana Alves' },
                  ]}
                  disabled={!form.values.is_estagiario}
                  required={form.values.is_estagiario}
                  {...form.getInputProps('supervisor')}
                />
              </Group>
            </Stack>
          </Card>
        </Stack>

        <Group justify="flex-end" mt="md">
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
            Salvar
          </Button>
        </Group>
      </form>
    </PageLayout>
  )
}
