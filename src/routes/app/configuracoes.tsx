import { createFileRoute } from '@tanstack/react-router'
import {
  Container,
  Title,
  Card,
  Stack,
  Group,
  Avatar,
  Text,
  Button,
  TextInput,
  Textarea,
  Select,
  Grid,
  ActionIcon,
  FileInput,
  rem,
  Flex,
  NavLink,
  Divider,
} from '@mantine/core'
import {
  IconUser,
  IconSettings,
  IconCamera,
  IconPencil,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useProfileView, useUserUpdate } from '../../api/endpoints/api/api'
import type { MUser, Endereco } from '../../api/models'
import { notifications } from '@mantine/notifications'

export const Route = createFileRoute('/app/configuracoes')({
  component: Configuracoes,
})

//   configuracoes: {
//     notificacoes: true,
//     agendamentoOnline: true,
//     lembretesPacientes: true
//   }

type EditableUser = Pick<
  MUser,
  | 'nome_completo'
  | 'email'
  | 'numero_telefone'
  | 'crp'
  | 'especialidade'
  | 'bio'
  | 'avatar'
> & {
  endereco: Endereco
}

const estados = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' },
]

const especialidades = [
  { label: 'Psicologia Escolar/Educacional', value: 'ESCOLAR' },
  { label: 'Psicologia Organizacional e do Trabalho', value: 'ORGANIZACIONAL' },
  { label: 'Psicologia de Trânsito', value: 'TRANSITO' },
  { label: 'Psicologia Jurídica', value: 'JURIDICA' },
  { label: 'Psicologia do Esporte', value: 'ESPORTE' },
  { label: 'Psicologia Clínica', value: 'CLINICA' },
  { label: 'Psicologia Hospitalar', value: 'HOSPITALAR' },
  { label: 'Psicopedagogia', value: 'PSICOPEDAGOGIA' },
  { label: 'Psicomotricidade', value: 'PSICOMOTRICIDADE' },
  { label: 'Psicologia Social', value: 'SOCIAL' },
  { label: 'Neuropsicologia', value: 'NEURO' },
  { label: 'Psicologia em Saúde', value: 'SAUDE' },
  { label: 'Avaliação Psicológica', value: 'AVALIACAO' },
]

function Configuracoes() {
  const { data: perfil, isError, isLoading, isSuccess } = useProfileView()
  const { mutate: editarPerfil } = useUserUpdate()
  const [userData, setUserData] = useState<EditableUser>()
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState('perfil')

  useEffect(() => {
    if (isSuccess && perfil) {
      setUserData(perfil)
    }
  }, [isSuccess, perfil])

  if (isLoading) {
    return (
      <>
        <Title order={1} mb="xs">
          Carregando...
        </Title>
        <Text size="lg">
          Espere um pouco enquanto seus dados são carregados.
        </Text>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Title order={1} mb="xs">
          Erro!
        </Title>
        <Text size="lg">
          Não foi possível carregar as configurações, tente novamente.
        </Text>
      </>
    )
  }

  const getEspecialidade = (value: string | undefined) => {
    const item = especialidades.find(e => e.value === value)
    return item ? item.label : 'Sem especialidade definida'
  }

  const handleSave = () => {
    setIsEditing(false)
    const dados = {
      ...userData,
      avatar: undefined,
      avatar_base64: userData?.avatar,
    }
    editarPerfil(
      { data: dados! },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Sucesso!',
            message: 'Dados pessoais alterados com sucesso.',
            color: 'green',
          })
        },
        onError: () => {
          notifications.show({
            title: 'Erro!',
            message: 'Não foi possível alterar seu dados, tente novamente.',
            color: 'red',
          })
        },
      }
    )
    console.log(JSON.stringify(userData, null, 2))
  }

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      // reader.onload = (e) => {
      //   setUserData(prev => ({ ...prev, avatar: e.target?.result as string }))
      // }
      reader.onload = e => {
        handleChange('avatar', e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function handleChange<K extends keyof MUser>(field: K, value: MUser[K]) {
    setUserData(prev => (prev ? { ...prev, [field]: value } : prev))
  }
  function handleEnderecoChange<K extends keyof Endereco>(
    field: K,
    value: Endereco[K]
  ) {
    setUserData(prev =>
      prev ? { ...prev, endereco: { ...prev.endereco, [field]: value } } : prev
    )
  }

  return (
    userData && (
      <Container size="xl">
        <Title order={2} mb="lg">
          Configurações
        </Title>
        <title>Configurações</title>

        <Flex gap="xl">
          {/* Sidebar Menu */}
          <Stack w={200} gap="xs">
            <NavLink
              label="Meu Perfil"
              leftSection={
                <IconUser style={{ width: rem(16), height: rem(16) }} />
              }
              active={activeSection === 'perfil'}
              onClick={() => setActiveSection('perfil')}
            />
            <NavLink
              label="Configurações Gerais"
              leftSection={
                <IconSettings style={{ width: rem(16), height: rem(16) }} />
              }
              active={activeSection === 'geral'}
              onClick={() => setActiveSection('geral')}
            />
          </Stack>

          {/* Content Area */}
          <Stack flex={1}>
            {activeSection === 'perfil' && (
              <Card withBorder radius="md" p="xl">
                <Stack gap="lg">
                  <Group justify="space-between">
                    <Title order={3}>Informações Pessoais</Title>
                    <Button
                      variant={isEditing ? 'filled' : 'light'}
                      leftSection={
                        <IconPencil
                          style={{ width: rem(16), height: rem(16) }}
                        />
                      }
                      onClick={() =>
                        isEditing ? handleSave() : setIsEditing(true)
                      }
                    >
                      {isEditing ? 'Salvar' : 'Editar'}
                    </Button>
                  </Group>

                  {/* Avatar Section */}
                  <Group>
                    <div style={{ position: 'relative' }}>
                      <Avatar
                        size={120}
                        src={userData.avatar}
                        radius="md"
                        name={userData.nome_completo}
                        color="initials"
                      />
                      {isEditing && (
                        <ActionIcon
                          size="lg"
                          radius="xl"
                          variant="filled"
                          style={{
                            position: 'absolute',
                            bottom: -5,
                            right: -5,
                          }}
                        >
                          <label
                            htmlFor="avatar-upload"
                            style={{ cursor: 'pointer' }}
                          >
                            <IconCamera
                              style={{ width: rem(20), height: rem(20) }}
                            />
                            <FileInput
                              description="Tamanho máximo de 5MB"
                              id="avatar-upload"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </ActionIcon>
                      )}
                    </div>
                    <Stack gap="xs">
                      <Text size="xl" fw={600}>
                        {userData.nome_completo}
                      </Text>
                      <Text c="dimmed">
                        {getEspecialidade(userData.especialidade)}
                      </Text>
                      <Text c="dimmed" size="sm">
                        {userData.crp}
                      </Text>
                    </Stack>
                  </Group>

                  {/* Form Fields */}
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Nome Completo"
                        value={userData.nome_completo || ''}
                        onChange={e =>
                          handleChange('nome_completo', e.currentTarget.value)
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    {/* <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Nome"
                      value={userData.firstName}
                      onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Sobrenome"
                      value={userData.lastName}
                      onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </Grid.Col> */}
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Email"
                        type="email"
                        value={userData.email || ''}
                        onChange={e =>
                          handleChange('email', e.currentTarget.value)
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Telefone"
                        value={userData.numero_telefone || ''}
                        onChange={e =>
                          handleChange('numero_telefone', e.currentTarget.value)
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="CRP"
                        value={userData.crp || ''}
                        onChange={e =>
                          handleChange('crp', e.currentTarget.value)
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Select
                        label="Especialidade"
                        value={userData.especialidade || ''}
                        onChange={value =>
                          handleChange('especialidade', value || '')
                        }
                        disabled={!isEditing}
                        data={especialidades}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea
                        label="Biografia Profissional"
                        description="Esta informação será exibida em seu perfil público"
                        rows={4}
                        value={userData.bio || ''}
                        onChange={e =>
                          handleChange('bio', e.currentTarget.value)
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                  </Grid>

                  <Divider my="xl" />

                  {/* Address Section */}
                  <div>
                    <Title order={4} mb="md">
                      Endereço
                    </Title>
                    <Grid>
                      <Grid.Col span={{ base: 12, sm: 4 }}>
                        <TextInput
                          label="CEP"
                          value={userData.endereco.cep || ''}
                          onChange={e =>
                            handleEnderecoChange('cep', e.currentTarget.value)
                          }
                          disabled={!isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 4 }}>
                        <TextInput
                          label="Rua"
                          value={userData.endereco.rua || ''}
                          onChange={e =>
                            handleEnderecoChange('rua', e.currentTarget.value)
                          }
                          disabled={!isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 4 }}>
                        <TextInput
                          label="Número"
                          value={userData.endereco.numero || ''}
                          onChange={e =>
                            handleEnderecoChange(
                              'numero',
                              e.currentTarget.value
                            )
                          }
                          disabled={!isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Bairro"
                          value={userData.endereco.bairro || ''}
                          onChange={e =>
                            handleEnderecoChange(
                              'bairro',
                              e.currentTarget.value
                            )
                          }
                          disabled={!isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 4 }}>
                        <TextInput
                          label="Cidade"
                          value={userData.endereco.cidade || ''}
                          onChange={e =>
                            handleEnderecoChange(
                              'cidade',
                              e.currentTarget.value
                            )
                          }
                          disabled={!isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 2 }}>
                        <Select
                          label="Estado"
                          value={userData.endereco.uf || ''}
                          onChange={value =>
                            handleEnderecoChange('uf', value || '')
                          }
                          disabled={!isEditing}
                          data={estados}
                        />
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <TextInput
                          label="Complemento"
                          placeholder="Sala, andar, bloco..."
                          value={userData.endereco.complemento || ''}
                          onChange={e =>
                            handleEnderecoChange(
                              'complemento',
                              e.currentTarget.value
                            )
                          }
                          disabled={!isEditing}
                        />
                      </Grid.Col>
                    </Grid>
                  </div>
                </Stack>
              </Card>
            )}

            {activeSection === 'geral' && (
              <Card withBorder radius="md" p="xl">
                <Stack gap="lg">
                  <Title order={3}>Configurações Gerais</Title>

                  <Text size="sm" c="dimmed">
                    Em desenvolvimento... Aqui ficarão as configurações de
                    notificações, preferências de agendamento e outras
                    configurações do sistema.
                  </Text>
                </Stack>
              </Card>
            )}
          </Stack>
        </Flex>
      </Container>
    )
  )
}
