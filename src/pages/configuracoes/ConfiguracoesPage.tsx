import {
  Button,
  Center,
  Container,
  Flex,
  Loader,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core'
import { IconBriefcase, IconUser } from '@tabler/icons-react'
import {
  usePerfilPsicologoDetail,
  useUsuarioDetail,
} from '@/api/endpoints/users/users'
import { PapelEnum } from '@/api/models'
import { useAlterarTitle } from '@/hooks/useAlterarTitle'
import AbaConta from './components/AbaConta'
import AbaPerfil from './components/AbaPerfil'

export default function ConfiguracoesPage() {
  useAlterarTitle('Configurações')

  const {
    data: dadosUsuario,
    isLoading: usuarioIsLoading,
    refetch,
  } = useUsuarioDetail({
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

  if (usuarioIsLoading || perfilIsLoading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader color="indigo" type="dots" />
      </Center>
    )
  }

  if (!dadosUsuario) {
    return (
      <Center style={{ height: '60vh' }}>
        <Flex direction="column" align="center" gap="xs" py="lg">
          <Text size="lg">Não foi possível buscar seus dados</Text>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </Flex>
      </Center>
    )
  }

  const semPerfil = dadosUsuario.papel === PapelEnum.GESTOR
  const vinculado =
    dadosUsuario.vinculo !== undefined && dadosUsuario.vinculo !== null

  return (
    <Container size="lg">
      <Stack gap="xl">
        <div>
          <Title order={2}>Configurações</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Gerencie suas informações pessoais e profissionais
          </Text>
        </div>

        <Tabs defaultValue="conta" orientation="horizontal">
          <Tabs.List mb="lg">
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
