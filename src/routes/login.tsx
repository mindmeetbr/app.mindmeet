import {
  createFileRoute,
  redirect,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import {
  Card,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Stack,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { z } from 'zod'
import { useApiAuthLoginCreate } from '../api/endpoints/api/api'
import useAuthStore from '../stores/auth-store'
import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { showNotification } from '@mantine/notifications'
import { IconCheck } from '@tabler/icons-react'
import { useAlterarTitle } from '../hooks/useAlterarTitle'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: '/app' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  useAlterarTitle('Login')
  const authStore = useAuthStore()
  const router = useRouter()
  const state = useLocation().state as { mensagem?: string }
  const notifMostrada = useRef(false)

  useEffect(() => {
    const mensagem = state?.mensagem
    if (!notifMostrada.current && mensagem) {
      showNotification({
        title: 'Sucesso!',
        message: mensagem,
        color: 'green',
        autoClose: false,
        icon: <IconCheck size={16} />,
      })
      notifMostrada.current = true
    }
  }, [state?.mensagem])
  const { mutate: login, isPending } = useApiAuthLoginCreate({
    mutation: {
      onSuccess: data => {
        authStore.login(data.access)
        authStore.setUser(data.user)
        router.navigate({ to: '/app' })
      },
      onError: (error: any) => {
        // erros gerados automaticamente no backend
        const errosBackend = error?.response.data
        if (errosBackend) {
          form.setErrors(errosBackend)

          if (errosBackend.non_field_errors) {
            showNotification({
              title: 'Erro de login',
              message: errosBackend.non_field_errors[0],
              color: 'red',
            })
          }
        }
      },
    },
  })

  const schema = z.object({
    email: z.email('Endereço de email inválido'),
    password: z.string().min(8, 'A senha deve possuir no mínimo 8 caracteres'),
  })

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: values => {
      const result = schema.safeParse(values)
      if (result.error) {
        // return z.treeifyError(result.error)
        const erros = z.flattenError(result.error)
        return erros.fieldErrors
      }
      return {}
    },
  })

  const handleSubmit = (values: { email: string; password: string }) => {
    login({
      data: {
        email: values.email,
        password: values.password,
      },
    })
  }

  return (
    <Container
      size="xs"
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
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <Stack gap="lg">
          <div style={{ textAlign: 'center' }}>
            <Title order={2} mb="xs">
              Bem-vindo de volta
            </Title>
            <Text c="dimmed" size="sm" mb="xs">
              Faça login para continuar
            </Text>
            <Text size="sm">
              Ainda não tem uma conta? <Link to="/cadastro">Crie uma!</Link>
            </Text>
          </div>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Digite seu e-mail"
                required
                error={form.errors.email}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                required
                error={form.errors.password}
                styles={{ input: { caretColor: 'var(--mantine-color-indigo-9)' } }}
                {...form.getInputProps('password')}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                mt="md"
                loading={isPending}
                loaderProps={{ type: 'dots', color: '#fff' }}
              >
                Entrar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  )
}
