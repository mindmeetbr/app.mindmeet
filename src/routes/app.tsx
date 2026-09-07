import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Indicator,
  Menu,
  NavLink,
  rem,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconBell,
  IconBuildingCommunity,
  IconCalendarWeek,
  IconChevronDown,
  IconClock,
  IconDashboard,
  IconLogout,
  IconMoonStars,
  IconSettings,
  IconSun,
  IconUsers,
} from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthLogoutCreate } from '../api/endpoints/auth/auth'
import { useNotificacaoPendenteList } from '../api/endpoints/notificacoes/notificacoes'
import { PapelEnum } from '../api/models'
import useAuthStore from '../stores/auth-store'

export const Route = createFileRoute('/app')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  const { isAuthenticated, logout: logoutFront, user } = useAuthStore()
  const queryClient = useQueryClient()
  const { mutate: logoutBack } = useAuthLogoutCreate({
    mutation: {
      onSuccess: () => {
        queryClient.clear()
        logoutFront()
      },
    },
  })
  const { setColorScheme } = useMantineColorScheme()
  const redirector = useRouter()
  const computedColorScheme = useComputedColorScheme('light')
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
  const { location } = useRouterState()

  const handleLogoutClick = () => logoutBack()

  useEffect(() => {
    if (!isAuthenticated) {
      redirector.navigate({ to: '/login' })
    }
  }, [isAuthenticated, redirector])

  useEffect(() => {
    closeMobile()
  }, [location.pathname, closeMobile])

  const isGestor = user?.papel === PapelEnum.GESTOR
  const isPsicologo = user?.papel === PapelEnum.PSICOLOGO

  const { data: pendentes } = useNotificacaoPendenteList({
    query: {
      staleTime: 10 * 60 * 1000, // 10 minutos
      refetchInterval: 10 * 60 * 1000, // 10 minutos
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      queryKey: ['notificacoes-pendentes'],
    },
  })

  const temNaoLidas = !!pendentes?.nao_lidas && pendentes.nao_lidas > 0

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      py="md"
      px="sm"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group h="100%" justify="flex-start" gap="xs">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />

            <Text size="xl" fw={700} c="blue">
              MindMeet
            </Text>
          </Group>

          <Group gap="sm">
            <ActionIcon
              size="lg"
              variant="subtle"
              aria-label="Alterar esquema de cor"
              onClick={() =>
                setColorScheme(
                  computedColorScheme === 'light' ? 'dark' : 'light'
                )
              }
            >
              {computedColorScheme === 'light' ? (
                <IconSun stroke={1.5} />
              ) : (
                <IconMoonStars stroke={1.5} />
              )}
            </ActionIcon>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar size={32} radius="xl" />
                    <Text fw={500} size="sm" lh={1} mr={3} visibleFrom="xs">
                      {user?.email || 'Usuário'}
                    </Text>
                    <IconChevronDown
                      style={{ width: rem(12), height: rem(12) }}
                      stroke={1.5}
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item disabled style={{ opacity: 1 }} hiddenFrom="xs">
                  <Text size="xs" c="dimmed">
                    Autenticado como
                  </Text>
                  <Text size="sm" fw={500}>
                    {user?.nome_completo}
                  </Text>
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Configurações
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={handleLogoutClick}
                  color="red"
                >
                  Sair
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          to="/app"
          label="Dashboard"
          leftSection={
            <IconDashboard style={{ width: rem(16), height: rem(16) }} />
          }
          activeOptions={{ exact: true }}
        />
        {isPsicologo && (
          <NavLink
            component={Link}
            to="/app/agenda"
            label="Agenda"
            leftSection={
              <IconCalendarWeek style={{ width: rem(16), height: rem(16) }} />
            }
            activeOptions={{ exact: true }}
          />
        )}
        {isPsicologo && (
          <NavLink
            component={Link}
            to="/app/disponibilidade"
            label="Disponibilidade"
            leftSection={
              <IconClock style={{ width: rem(16), height: rem(16) }} />
            }
            activeOptions={{ exact: true }}
          />
        )}
        {isPsicologo && (
          <NavLink
            component={Link}
            to="/app/pacientes"
            label="Pacientes"
            leftSection={
              <IconUsers style={{ width: rem(16), height: rem(16) }} />
            }
            activeOptions={{ exact: true }}
          />
        )}
        <NavLink
          component={Link}
          to="/app/configuracoes"
          label="Configurações"
          leftSection={
            <IconSettings style={{ width: rem(16), height: rem(16) }} />
          }
          activeOptions={{ exact: true }}
        />
        <NavLink
          component={Link}
          to="/app/notificacoes"
          label="Notificações"
          leftSection={
            <Indicator
              disabled={!temNaoLidas}
              position="top-start"
              color="red"
              size={8}
              offset={2}
            >
              <IconBell style={{ width: rem(16), height: rem(16) }} />
            </Indicator>
          }
          activeOptions={{ exact: true }}
        />

        {isGestor && (
          <NavLink
            component={Link}
            to="/app/instituicao"
            label="Instituição"
            leftSection={
              <IconBuildingCommunity
                style={{ width: rem(16), height: rem(16) }}
              />
            }
            activeOptions={{ exact: true }}
          />
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
