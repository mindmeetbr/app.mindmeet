import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import {
  AppShell,
  Text,
  NavLink,
  Group,
  Avatar,
  UnstyledButton,
  Menu,
  rem,
  Indicator,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core'
import {
  IconDashboard,
  IconSettings,
  IconUsers,
  IconLogout,
  IconChevronDown,
  IconClock,
  IconBell,
  IconBuildingCommunity,
  IconSun,
  IconMoonStars,
} from '@tabler/icons-react'
import useAuthStore from '../stores/auth-store'
import { useNotificacaoPendenteList } from '../api/endpoints/api/api'
import { useEffect } from 'react'
import { PapelEnum } from '../api/models'

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
  const { isAuthenticated, logout, user } = useAuthStore()
  const redirector = useRouter()
  const { data: pendentes } = useNotificacaoPendenteList({
    query: {
      staleTime: 10 * 60 * 1000, // 10 minutos
      refetchInterval: 10 * 60 * 1000, // 10 minutos
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      queryKey: ['notificacoes-pendentes'],
    },
  })
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  const handleLogoutClick = () => {
    logout()
  }

  const temNaoLidas = !!pendentes?.nao_lidas && pendentes.nao_lidas > 0

  useEffect(() => {
    if (!isAuthenticated) {
      redirector.navigate({ to: '/login' })
    }
  }, [isAuthenticated, redirector])

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text size="xl" fw={700} c="blue">
            MindMeet
          </Text>

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
                    <Text fw={500} size="sm" lh={1} mr={3}>
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
        <NavLink
          component={Link}
          to="/app/disponibilidade"
          label="Disponibilidade"
          leftSection={
            <IconClock style={{ width: rem(16), height: rem(16) }} />
          }
          activeOptions={{ exact: true }}
        />
        <NavLink
          component={Link}
          to="/app/pacientes"
          label="Pacientes"
          leftSection={
            <IconUsers style={{ width: rem(16), height: rem(16) }} />
          }
          activeOptions={{ exact: true }}
        />
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

        {user?.papel === PapelEnum.GESTOR && (
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
