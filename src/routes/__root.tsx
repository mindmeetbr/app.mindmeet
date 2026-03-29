import { Button, Group, Text, Flex, Divider } from '@mantine/core'
import {
  createRootRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import classes from './__root.module.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const matchRoute = useMatchRoute()
  const paginaInicial =
    matchRoute({ from: '/', to: '/' }) ||
    matchRoute({ from: '/', to: '/login' }) ||
    matchRoute({ from: '/', to: '/cadastro', fuzzy: true }) ||
    matchRoute({ from: '/', to: '/psicologo/$id' }) ||
    matchRoute({ from: '/', to: '/sobre' })

  const isCadastroIndex = matchRoute({
    from: '/',
    to: '/cadastro',
    fuzzy: false,
  })

  const isLogin = matchRoute({ from: '/', to: '/login' })

  return (
    <>
      {paginaInicial && (
        <header style={{ height: 45 }}>
          <Flex
            justify="space-between"
            align="center"
            h="100%"
            w="100%"
            px="md"
          >
            {/* esquerda */}
            <Flex flex={1} justify="flex-start">
              <Text size="xl" fw={700} c="blue" component={Link} to="/">
                MindMeet
              </Text>
            </Flex>

            {/* meio */}
            <Flex flex={1} justify="center">
              <Group gap="lg">
                <Text
                  component={Link}
                  className={classes.link}
                  to="/sobre"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className: `${classes.link} ${classes.active}`,
                  }}
                >
                  Sobre o Projeto
                </Text>
              </Group>
            </Flex>

            {/* direita */}
            <Flex flex={1} justify="flex-end">
              <Group>
                {!isLogin && (
                  <Button
                    variant="outline"
                    size="xs"
                    component={Link}
                    to="/login"
                  >
                    Entrar
                  </Button>
                )}
                {!isCadastroIndex && (
                  <Button size="xs" component={Link} to="/cadastro">
                    Cadastrar-se
                  </Button>
                )}
              </Group>
            </Flex>
          </Flex>
          <Divider />
        </header>
      )}

      <main>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  )
}
