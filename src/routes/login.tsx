import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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
import {
  useApiAuthLoginCreate,
  useApiAuthUserRetrieve,
} from '../api/endpoints/api/api'
import useAuthStore from '../stores/auth-store'
import { Link } from '@tanstack/react-router'

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
  const authStore = useAuthStore()
  const router = useRouter()
  const { isAuthenticated } = authStore

  const { data: _user } = useApiAuthUserRetrieve({
    query: {
      enabled: isAuthenticated,
      queryKey: ['user'],
    },
  })

  const { mutate: login } = useApiAuthLoginCreate({
    mutation: {
      onSuccess: data => {
        authStore.login(data.access)
        router.navigate({ to: '/app' })
      },
    },
  })

  const schema = z.object({
    email: z.email('Invalid email address'),
    // username: z.string('Invalid username'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })

  const form = useForm({
    initialValues: {
      email: '',
      // username: '',
      password: '',
    },
    validate: values => {
      const result = schema.safeParse(values)
      if (!result.success) {
        return z.treeifyError(result.error)
      }
      return {}
    },
  })

  const handleSubmit = (values: {
    email: string
    // username: string
    password: string
  }) => {
    login({
      data: {
        email: values.email,
        // username: values.username,
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
        {/* {user && (
          <Stack gap="lg">
            <Text>Bem-vindo, {user.username}</Text>
          </Stack>
        )} */}
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
                {...form.getInputProps('email')}
              />

              {/* <TextInput
                label="Nome de usuário"
                placeholder="ciro.moura"
                required
                {...form.getInputProps('username')}
              /> */}

              <PasswordInput
                label="Senha"
                placeholder="Digite sua senha"
                required
                {...form.getInputProps('password')}
              />

              <Button type="submit" fullWidth size="md" mt="md">
                Entrar
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Container>
  )
}
