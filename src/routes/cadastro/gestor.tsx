import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import useAuthStore from '../../stores/auth-store'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import dayjs from 'dayjs'
import {
  Button,
  Card,
  Container,
  Group,
  PasswordInput,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import {
  IconBuildingCommunity,
  IconCircleCheck,
  IconLock,
  IconUser,
  IconX,
  IconCheck,
} from '@tabler/icons-react'
import { DateInput, DatesProvider } from '@mantine/dates'
import { useUsuarioCreate } from '../../api/endpoints/users/users'
import { PapelEnum } from '../../api/models'
import { notifications } from '@mantine/notifications'
import classes from './gestor.module.css'
import { useMediaQuery } from '@mantine/hooks'

export const Route = createFileRoute('/cadastro/gestor')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: '/app' })
    }
  },
  component: CadastroGestor,
})

const requisitosSenha = [
  { label: 'Mínimo de 8 caracteres', teste: (v: string) => v.length >= 8 },
  { label: 'Uma letra maiúscula', teste: (v: string) => /[A-Z]/.test(v) },
  { label: 'Uma letra minúscula', teste: (v: string) => /[a-z]/.test(v) },
  { label: 'Um número', teste: (v: string) => /[0-9]/.test(v) },
  {
    label: 'Um símbolo especial',
    teste: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
]

const formatarCNPJ = (valor: string) => {
  const digitos = valor.replace(/\D/g, '').slice(0, 14)
  return digitos
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function CadastroGestor() {
  const isMobile = useMediaQuery('(max-width: 48rem)')

  const router = useRouter()
  const { mutate: criarGestor } = useUsuarioCreate()

  const camposPasso = [
    ['nome_completo', 'username', 'email', 'data_nascimento'],
    ['password1', 'password2'],
    ['instituicao.nome', 'instituicao.cnpj'],
  ]

  const [active, setActive] = useState(0)

  const avancarEtapa = () => {
    const camposParaValidar = camposPasso[active]
    let erro = false

    camposParaValidar.forEach(campo => {
      const resultado = form.validateField(campo)
      if (resultado.hasError) erro = true
    })

    if (!erro) {
      setActive((current: number) => (current < 2 ? current + 1 : current))
    }
  }
  const voltarEtapa = () =>
    setActive((current: number) => (current > 0 ? current - 1 : current))

  const form = useForm({
    initialValues: {
      nome_completo: '',
      username: '',
      email: '',
      data_nascimento: null,
      password1: '',
      password2: '',
      instituicao: {
        nome: '',
        cnpj: '',
      },
    },
    validate: {
      instituicao: {
        nome: value =>
          value.trim().length > 0 ? null : 'Instituição inválida',
        cnpj: value =>
          /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value)
            ? null
            : 'CNPJ inválido',
      },

      nome_completo: value =>
        value.trim().length > 0 ? null : 'Nome completo inválido',

      username: value =>
        value.trim().length > 0 ? null : 'Nome de usuário inválido',

      email: value => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email inválido'),

      password1: value => {
        const falhou = requisitosSenha.find(req => !req.teste(value))
        return falhou ? `Requisito não atendido: ${falhou.label}` : null
      },

      password2: (value, values) => {
        if (value.length === 0)
          return 'A confirmação da senha não pode ser vazia'
        if (values.password1 && value !== values.password1) {
          return 'As senhas não coincidem, tente novamente'
        }
        return null
      },
      data_nascimento: value => {
        if (!value) return 'Data de nascimento é obrigatória'
        if (dayjs(value).isAfter(dayjs()))
          return 'A data não pode estar no futuro'
        return null
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const data = {
      ...values,
      papel: PapelEnum.GESTOR,
    }

    console.log(JSON.stringify(data, null, 2))

    criarGestor(
      { data },
      {
        onSuccess: () => {
          form.clearErrors()
          router.navigate({
            to: '/login',
            state: { mensagem: 'Cadastro concluído. Aproveite!' },
          })
        },
        onError: error => {
          form.setErrors(error.response?.data)
          notifications.show({
            color: 'red',
            autoClose: 10000,
            title: 'Erro!',
            message:
              'Não foi possível criar sua conta. Certifique-se de que todos os campos estão corretos e tente novamente.',
            icon: <IconX />,
          })
        },
      }
    )
  }

  return (
    <Container size="sm" className={classes.page}>
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        className={classes.card}
      >
        <Stack gap="lg">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} mb="xs">
              Bem vindo ao MindMeet
            </Title>
            <Text c="dimmed" size="sm" mb="xs">
              Crie sua conta para continuar
            </Text>
            <Text size="sm">
              Já tem uma conta? <Link to="/login">Faça login</Link>
            </Text>
          </div>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stepper
              active={active}
              onStepClick={setActive}
              allowNextStepsSelect={false}
              size="md"
              iconSize={22}
              completedIcon={<IconCircleCheck size={18} />}
              styles={
                isMobile
                  ? {
                      stepLabel: { display: 'none' },
                      stepDescription: { display: 'none' },
                    }
                  : undefined
              }
            >
              <Stepper.Step
                label="Dados Pessoais"
                icon={<IconUser size={18} />}
              >
                <Stack gap="sm">
                  <TextInput
                    label="Nome completo"
                    placeholder="Digite seu nome completo"
                    required
                    autoComplete="off"
                    {...form.getInputProps('nome_completo')}
                    error={form.errors.nome_completo}
                  />
                  <TextInput
                    label="Seu nome de usuário"
                    placeholder="Insira um nome de usuário"
                    required
                    autoComplete="off"
                    {...form.getInputProps('username')}
                    error={form.errors.username}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Insira seu email"
                    required
                    autoComplete="off"
                    {...form.getInputProps('email')}
                    error={form.errors.email}
                  />

                  <DatesProvider settings={{ locale: 'pt-BR' }}>
                    <DateInput
                      label="Data de nascimento"
                      placeholder="Digite no formato DD/MM/AAAA"
                      valueFormat="DD/MM/YYYY"
                      dateParser={(input: string) => {
                        const parsed = dayjs(input, 'DD/MM/YYYY', true)
                        return parsed.isValid() ? parsed.toDate() : null
                      }}
                      clearable
                      required
                      {...form.getInputProps('data_nascimento')}
                      error={form.errors.data_nascimento}
                    />
                  </DatesProvider>
                </Stack>
                <Group justify="flex-end" mt="xl">
                  <Button onClick={avancarEtapa}>Próximo</Button>
                </Group>
              </Stepper.Step>
              <Stepper.Step label="Credenciais" icon={<IconLock size={18} />}>
                <Stack gap="sm">
                  <PasswordInput
                    label="Senha"
                    placeholder="Digite sua senha"
                    description="Deve conter um mínimo de 8 caracteres, letras maiúsculas e minúsculas e simbolos especiais"
                    required
                    styles={{
                      input: { caretColor: 'var(--mantine-color-indigo-9)' },
                    }}
                    autoComplete="off"
                    {...form.getInputProps('password1')}
                    error={form.errors.password1}
                  />
                  <Stack gap={4}>
                    {requisitosSenha.map(req => {
                      const atendido = req.teste(form.values.password1)
                      return (
                        <Group gap={6} key={req.label}>
                          {atendido ? (
                            <IconCheck
                              size={14}
                              color="var(--mantine-color-green-6)"
                            />
                          ) : (
                            <IconX
                              size={14}
                              color="var(--mantine-color-red-6)"
                            />
                          )}
                          <Text size="xs" c={atendido ? 'green' : 'dimmed'}>
                            {req.label}
                          </Text>
                        </Group>
                      )
                    })}
                  </Stack>
                  <PasswordInput
                    label="Confirme sua senha"
                    placeholder="Digite sua senha novamente"
                    description=""
                    required
                    styles={{
                      input: { caretColor: 'var(--mantine-color-indigo-9)' },
                    }}
                    {...form.getInputProps('password2')}
                    error={form.errors.password2}
                  />
                </Stack>
                <Group justify="space-between" mt="xl">
                  <Button variant="default" onClick={voltarEtapa}>
                    Voltar
                  </Button>
                  <Button onClick={avancarEtapa}>Próximo</Button>
                </Group>
              </Stepper.Step>

              <Stepper.Step
                label="Instituição"
                icon={<IconBuildingCommunity size={18} />}
              >
                <Stack gap="md">
                  <TextInput
                    label="Nome"
                    placeholder="Digite o nome da sua instituição"
                    required
                    autoComplete="off"
                    {...form.getInputProps('instituicao.nome')}
                  />
                  <TextInput
                    label="CNPJ"
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    required
                    autoComplete="off"
                    {...form.getInputProps('instituicao.cnpj')}
                    onChange={event => {
                      const formatado = formatarCNPJ(event.currentTarget.value)
                      form.setFieldValue('instituicao.cnpj', formatado)
                    }}
                    // error={form.errors.instituicao.cnpj}
                  />
                </Stack>
                <Group justify="space-between" mt="xl">
                  <Button variant="default" onClick={voltarEtapa}>
                    Voltar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </Group>
              </Stepper.Step>
            </Stepper>
          </form>
        </Stack>
      </Card>
    </Container>
  )
}
