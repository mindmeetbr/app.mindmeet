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
} from '@tabler/icons-react'
import { DatePickerInput, DatesProvider } from '@mantine/dates'
import { useUsuarioCreate } from '../../api/endpoints/users/users'
import { PapelEnum } from '../../api/models'
import { notifications } from '@mantine/notifications'

export const Route = createFileRoute('/cadastro/gestor')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: '/app' })
    }
  },
  component: CadastroGestor,
})

function CadastroGestor() {
  const router = useRouter()
  const { mutate: criarGestor } = useUsuarioCreate()

  const camposPasso = [
    ['nome_completo', 'username', 'email', 'data_nascimento'],
    ['password1', 'password2'],
    ['instituicao.nome', 'instituicao.cnpj'],
  ]

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

  const [active, setActive] = useState(0)
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
        cnpj: value => {
          if (value.length < 14 || value.length > 18) return 'CNPJ inválido'
          else if (value.length === 18) {
            return /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(value)
              ? null
              : 'CNPJ inválido'
          } else if (value.length === 14) {
            return /\d{14}/.test(value) ? null : 'CNPJ inválido'
          }
          return 'CNPJ inválido'
        },
      },

      nome_completo: value =>
        value.trim().length > 0 ? null : 'Nome completo inválido',

      username: value =>
        value.trim().length > 0 ? null : 'Nome de usuário inválido',

      email: value => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email inválido'),

      password1: value => {
        if (value.length < 8) {
          return 'A senha deve ter pelo menos 8 caracteres'
        }
        if (!/[A-Z]/.test(value)) {
          return 'A senha deve conter pelo menos uma letra maiúscula'
        }
        if (!/[a-z]/.test(value)) {
          return 'A senha deve conter pelo menos uma letra minúscula'
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
          return 'A senha deve conter pelo menos um símbolo especial'
        }
        return null
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
    console.log(JSON.stringify(values, null, 2))
    const data = {
      ...form.values,
      papel: PapelEnum.GESTOR,
    }
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
    <Container
      size="sm"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{ width: '100%', maxWidth: '960px' }}
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
              size="xs"
              completedIcon={<IconCircleCheck size={18} />}
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
                    {...form.getInputProps('nome_completo')}
                    error={form.errors.nome_completo}
                  />
                  <TextInput
                    label="Seu nome de usuário"
                    placeholder="Insira um nome de usuário"
                    required
                    {...form.getInputProps('username')}
                    error={form.errors.username}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Insira seu email"
                    required
                    {...form.getInputProps('email')}
                    error={form.errors.email}
                  />
                  <DatesProvider
                    settings={{
                      locale: 'pt-BR',
                    }}
                  >
                    <DatePickerInput
                      label="Data de nascimento"
                      placeholder="Selecione sua data da nascimento"
                      valueFormat="DD/MM/YYYY"
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
                    {...form.getInputProps('password1')}
                    error={form.errors.password1}
                  />
                  <PasswordInput
                    label="Confirme sua senha"
                    placeholder="Digite sua senha novamente"
                    description=""
                    required
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
                    {...form.getInputProps('instituicao.nome')}
                    // error={form.errors.instituicao.nome}
                  />
                  <TextInput
                    label="CNPJ"
                    placeholder="Digite o CNPJ da sua instituição"
                    required
                    {...form.getInputProps('instituicao.cnpj')}
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
