import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
  useRouterState,
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
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import {
  IconDashboard,
  IconSettings,
  // IconCalendar,
  IconUsers,
  IconLogout,
  IconChevronDown,
  IconClock,
  IconEye,
  IconEyeOff,
  IconBell,
  IconBellExclamation,
  IconBuildingCommunity,
} from '@tabler/icons-react'
import useAuthStore from '../stores/auth-store'
import usePreferencesStore from '../stores/preferences-store'
import {
  useNotificacaoPendenteList,
  useProfileView,
} from '../api/endpoints/api/api'
import { useEffect, useState } from 'react'
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
  const { isAuthenticated, logout } = useAuthStore()
  const { hideFinancialDetails, toggleFinancialDetails } = usePreferencesStore()
  const router = useRouterState()
  const redirector = useRouter()
  const [temNaoLidas, setTemNaoLidas] = useState(false)
  const { data: pendentes, isError, isLoading } = useNotificacaoPendenteList()
  const { data: user } = useProfileView()

  const isActive = (path: string) => {
    return (
      router.location.pathname === path ||
      router.location.pathname.startsWith(`${path}/`)
    )
  }

  const handleLogoutClick = () => {
    logout()
  }

  useEffect(() => {
    if (!pendentes || isError || isLoading) setTemNaoLidas(false)
    else if (pendentes.nao_lidas > 0) setTemNaoLidas(true)
  }, [pendentes, isError, isLoading])

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
            <Tooltip
              label={
                hideFinancialDetails
                  ? 'Mostrar valores financeiros'
                  : 'Ocultar valores financeiros'
              }
              position="bottom"
            >
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={toggleFinancialDetails}
              >
                {hideFinancialDetails ? (
                  <IconEye style={{ width: rem(18), height: rem(18) }} />
                ) : (
                  <IconEyeOff style={{ width: rem(18), height: rem(18) }} />
                )}
              </ActionIcon>
            </Tooltip>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar size={32} radius="xl" />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {user?.email || user?.nome_completo || 'Usuário'}
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
          href="/app"
          label="Dashboard"
          leftSection={
            <IconDashboard style={{ width: rem(16), height: rem(16) }} />
          }
          active={router.location.pathname === '/app'}
        />
        {/* <NavLink
          href="/app/agendamentos"
          label="Agendamentos"
          leftSection={
            <IconCalendar style={{ width: rem(16), height: rem(16) }} />
          }
          active={isActive('/app/agendamentos')}
        /> */}
        <NavLink
          href="/app/disponibilidade"
          label="Disponibilidade"
          leftSection={
            <IconClock style={{ width: rem(16), height: rem(16) }} />
          }
          active={isActive('/app/disponibilidade')}
        />
        <NavLink
          href="/app/pacientes"
          label="Pacientes"
          leftSection={
            <IconUsers style={{ width: rem(16), height: rem(16) }} />
          }
          active={isActive('/app/pacientes')}
        />
        <NavLink
          href="/app/configuracoes"
          label="Configurações"
          leftSection={
            <IconSettings style={{ width: rem(16), height: rem(16) }} />
          }
          active={isActive('/app/configuracoes')}
        />
        <NavLink
          href="/app/notificacoes"
          label="Notificações"
          leftSection={
            temNaoLidas ? (
              <IconBellExclamation
                style={{ width: rem(16), height: rem(16), color: 'red' }}
              />
            ) : (
              <IconBell style={{ width: rem(16), height: rem(16) }} />
            )
          }
          active={isActive('/app/notificacoes')}
        />

        {user?.papel === PapelEnum.GESTOR && (
          <NavLink
            href="/app/instituicao"
            label="Instituição"
            leftSection={
              <IconBuildingCommunity
                style={{ width: rem(16), height: rem(16) }}
              />
            }
            active={isActive('/app/instituicao')}
          />
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
