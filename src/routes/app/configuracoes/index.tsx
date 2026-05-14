import { createFileRoute } from '@tanstack/react-router'
import {
  useUsuarioDetail,
  usePerfilPsicologoDetail,
} from '../../../api/endpoints/users/users'
import { useAlterarTitle } from '../../../hooks/useAlterarTitle'
import { PapelEnum } from '../../../api/models'
import {
  Center,
  Loader,
  Container,
  Stack,
  Tabs,
  Title,
  Text,
} from '@mantine/core'
import { IconUser, IconBriefcase } from '@tabler/icons-react'
import { AbaConta } from './-components/AbaConta'
import { AbaPerfil } from './-components/AbaPerfil'
export const Route = createFileRoute('/app/configuracoes/')({
  component: Configuracoes,
})

function Configuracoes() {
  useAlterarTitle('Configurações')

  const { data: dadosUsuario, isLoading: usuarioIsLoading } = useUsuarioDetail({
    query: {
      queryKey: ['dados-usuario'],
      gcTime: 10 * 60 * 1000,
    },
  })

  const { data: dadosPerfil, isLoading: perfilIsLoading } =
    usePerfilPsicologoDetail({
      query: {
        queryKey: ['dados-perfil'],
        gcTime: 10 * 60 * 1000,
        enabled: dadosUsuario?.papel === PapelEnum.PSICOLOGO,
      },
    })

  const semPerfil = dadosUsuario?.papel === PapelEnum.GESTOR
  const vinculado =
    dadosUsuario?.vinculo !== undefined && dadosUsuario?.vinculo !== null

  const perfilCarregando =
    dadosUsuario?.papel === PapelEnum.PSICOLOGO && perfilIsLoading

  if (usuarioIsLoading || perfilCarregando) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader color="blue" />
      </Center>
    )
  }

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Title order={2}>Configurações</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Gerencie suas informações pessoais e profissionais
          </Text>
        </div>

        <Tabs variant="pills" orientation="vertical" defaultValue="conta">
          <Tabs.List w={200} mr="xl">
            <Tabs.Tab value="conta" leftSection={<IconUser size={16} />}>
              Conta
            </Tabs.Tab>
            {!semPerfil && (
              <Tabs.Tab
                value="perfil"
                leftSection={<IconBriefcase size={16} />}
              >
                Perfil Profissional
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="conta" style={{ flex: 1 }}>
            <AbaConta dadosUsuario={dadosUsuario} vinculado={vinculado} />
          </Tabs.Panel>

          {!semPerfil && (
            <Tabs.Panel value="perfil" style={{ flex: 1 }}>
              <AbaPerfil dadosPerfil={dadosPerfil} vinculado={vinculado} />
            </Tabs.Panel>
          )}
        </Tabs>
      </Stack>
    </Container>
  )
}
