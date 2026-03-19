import {
  PasswordInput,
  TextInput,
  Button,
  Stack,
  Title,
  Text,
  Container,
  Card,
  // Switch,
  Group,
  Stepper,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DatePickerInput, DatesProvider } from '@mantine/dates'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useUsuarioCreate } from '../../api/endpoints/users/users'
import { notifications } from '@mantine/notifications'
import {
  IconX,
  IconUser,
  IconLock,
  IconBriefcase,
  IconCircleCheck,
} from '@tabler/icons-react'
import { useState } from 'react'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'
import { PapelEnum } from '../../api/models'
export const Route = createFileRoute('/cadastro/psicologo')({
  component: PaginaCadastro,
})

function PaginaCadastro() {
  const router = useRouter()
  const { mutate: criarUsuario } = useUsuarioCreate()
  const [active, setActive] = useState(0)
  const camposPasso = [
    ['nomeCompleto', 'username', 'email', 'dataNascimento'],
    ['password1', 'password2'],
    ['crp'],
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

  const form = useForm({
    initialValues: {
      nomeCompleto: '',
      username: '',
      email: '',
      password1: '',
      password2: '',
      dataNascimento: null,
      crp: '',
    },
    validate: {
      nomeCompleto: value =>
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

      dataNascimento: value => {
        if (!value) return 'Data de nascimento é obrigatória'
        if (dayjs(value).isAfter(dayjs()))
          return 'A data não pode estar no futuro'
        return null
      },

      crp: value => {
        return /^\d{2}\/\d{5}$/.test(value)
          ? null
          : 'CRP inválido. Use o formato 00/00000'
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const dataFormatada = dayjs(values.dataNascimento).format('YYYY-MM-DD')
    const data = {
      nome_completo: values.nomeCompleto,
      username: values.username,
      email: values.email,
      password1: values.password1,
      password2: values.password2,
      data_nascimento: dataFormatada,
      perfil_psicologo: {
        crp: values.crp,
      },
      papel: PapelEnum.PSICOLOGO,
    }

    console.log(JSON.stringify(data, null, 2))

    criarUsuario(
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
                    {...form.getInputProps('nomeCompleto')}
                    error={form.errors.nomeCompleto}
                  />
                  <TextInput
                    label="Seu nome de usuário"
                    placeholder="Insira um nome de usuário"
                    description="Este nome será exibido para outros usuários durante a busca"
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
                      {...form.getInputProps('dataNascimento')}
                      error={form.errors.dataNascimento}
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
                label="Profissional"
                icon={<IconBriefcase size={18} />}
              >
                <Stack gap="sm">
                  <TextInput
                    label="CRP"
                    placeholder="00/00000"
                    maxLength={8}
                    required
                    withAsterisk
                    {...form.getInputProps('crp')}
                    error={form.errors.crp}
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
