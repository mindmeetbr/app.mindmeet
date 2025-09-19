import {
  PasswordInput,
  TextInput,
  Button,
  Stack,
  Title,
  Text,
  Container,
  Card,
  Switch,
  Group,
  Stepper,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useUserCreate } from '../api/endpoints/api/api'
import { notifications } from '@mantine/notifications'
import {
  IconX,
  IconUser,
  IconLock,
  IconBriefcase,
  IconCircleCheck,
} from '@tabler/icons-react'
import { useState } from 'react'
export const Route = createFileRoute('/cadastro')({
  component: PaginaCadastro,
})

function PaginaCadastro() {
  const router = useRouter()
  const { mutate: criarUsuario } = useUserCreate()
  const [active, setActive] = useState(0)
  const camposPasso = [
    ['nomeCompleto', 'username', 'email', 'dataNascimento'],
    ['senha'],
    ['isEstagiario', 'crp', 'emailSupervisor'],
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
      senha: '',
      dataNascimento: '',
      crp: '',
      isEstagiario: false,
      emailSupervisor: '',
    },
    validate: {
      nomeCompleto: value =>
        value.trim().length > 0 ? null : 'Nome completo inválido',

      username: value =>
        value.trim().length > 0 ? null : 'Nome de usuário inválido',

      email: value => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email inválido'),

      senha: value => {
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

      dataNascimento: value =>
        !Number.isNaN(Date.parse(value)) ? null : 'Data de nascimento inválida',

      crp: (value, values) => {
        if (values.isEstagiario) return null
        else
          return /^\d{2}\/\d{5}$/.test(value)
            ? null
            : 'CRP inválido. Use o formato 00/00000'
      },

      emailSupervisor: (value, values) => {
        if (!values.isEstagiario) return null
        else return /^\S+@\S+\.\S+$/.test(value) ? null : 'Email inválido'
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    const data = {
      nome_completo: values.nomeCompleto,
      username: values.username,
      email: values.email,
      password: values.senha,
      data_nascimento: values.dataNascimento,
      crp: values.crp,
      is_estagiario: values.isEstagiario,
      supervisor: values.emailSupervisor,
    }

    criarUsuario(
      { data },
      {
        onSuccess: () => {
          router.navigate({ to: '/login' })
        },
        onError: () => {
          // TODO: mostrar outros erros futuramente
          notifications.show({
            c: 'red',
            autoClose: 10000,
            title: 'Erro!',
            message: 'Não foi possível criar sua conta, tente novamente.',
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
                  <DateInput
                    label="Data de nascimento"
                    placeholder="dd/mm/aaaa"
                    valueFormat="DD/MM/YYYY"
                    locale="pt-BR"
                    clearable
                    popoverProps={{ disabled: true }}
                    required
                    {...form.getInputProps('dataNascimento')}
                    error={form.errors.dataNascimento}
                  />
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
                    {...form.getInputProps('senha')}
                    error={form.errors.senha}
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
                  <Group grow>
                    <Switch
                      size="sm"
                      label="É estagiário?"
                      description="Marque somente se for estagiário"
                      withThumbIndicator={false}
                      {...form.getInputProps('isEstagiario')}
                      error={form.errors.isEstagiario}
                    />
                    {form.getValues().isEstagiario ? (
                      <TextInput
                        label="Supervisor"
                        placeholder="Insira o email do seu supervisor"
                        description="Buscaremos este email no nosso sistema e, caso ele exista, enviaremos uma notifição ao usuário para confirmação"
                        required={form.getValues().isEstagiario}
                        error={form.errors.isEstagiario}
                        {...form.getInputProps('emailSupervisor')}
                      />
                    ) : (
                      <TextInput
                        label="CRP"
                        placeholder="00/00000"
                        maxLength={8}
                        required={!form.getValues().isEstagiario}
                        {...form.getInputProps('crp')}
                        error={form.errors.crp}
                      />
                    )}
                  </Group>
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
