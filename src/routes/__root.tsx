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
    matchRoute({ from: '/', to: '/cadastro' }) ||
    matchRoute({ from: '/', to: '/psicologo/$id' }) ||
    matchRoute({ from: '/', to: '/about' })

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
                  to="/about"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className: `${classes.link} ${classes.active}`,
                  }}
                >
                  Sobre
                </Text>
                <Text
                  component={Link}
                  className={classes.link}
                  to="/app"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className: `${classes.link} ${classes.active}`,
                  }}
                >
                  Dashboard
                </Text>
                <Text
                  component={Link}
                  className={classes.link}
                  to="/psicologo/$id"
                  params={{ id: '1' }}
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className: `${classes.link} ${classes.active}`,
                  }}
                >
                  Perfil Público
                </Text>
              </Group>
            </Flex>

            {/* direita */}
            <Flex flex={1} justify="flex-end">
              <Group>
                <Button
                  variant="outline"
                  size="xs"
                  component={Link}
                  to="/login"
                >
                  Entrar
                </Button>
                <Button size="xs" component={Link} to="/cadastro">
                  Cadastrar-se
                </Button>
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
