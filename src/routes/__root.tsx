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
        <header style={{ height: 48 }}>
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

            {/* direita */}
            <Flex flex={1} justify="flex-end">
              <Group gap="xs" wrap="nowrap">
                {!isLogin && (
                  <Button
                    variant="outline"
                    size="xs"
                    component={Link}
                    to="/login"
                    px={{ base: 'xs', sm: 'md' }}
                  >
                    Entrar
                  </Button>
                )}
                {!isCadastroIndex && (
                  <Button
                    size="xs"
                    component={Link}
                    to="/cadastro"
                    px={{ base: 'xs', sm: 'md' }}
                  >
                    Cadastrar-se
                  </Button>
                )}
              </Group>
            </Flex>
          </Flex>
          <Divider />
        </header>
      )}

      <main className={classes.page}>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  )
}
