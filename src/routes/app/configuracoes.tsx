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
import { useState } from 'react'
import { useAlterarTitle } from '../../hooks/useAlterarTitle'

export const Route = createFileRoute('/app/configuracoes')({
  component: Configuracoes,
})

const mockUserData = {
  id: 1,
  firstName: 'Dr. Ana',
  lastName: 'Silva',
  email: 'ana.silva@email.com',
  phone: '(11) 99999-9999',
  crp: 'CRP 06/123456',
  abordagem: 'Psicanálise',
  bio: 'Psicóloga especialista em terapia cognitivo-comportamental com mais de 10 anos de experiência. Atendimento a adultos, adolescentes e casais.',
  avatar: null,
  endereco: {
    cep: '01234-567',
    rua: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    complemento: 'Sala 45',
  },
  configuracoes: {
    notificacoes: true,
    agendamentoOnline: true,
    lembretesPacientes: true,
  },
}

function Configuracoes() {
  useAlterarTitle('Configurações')
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState('perfil')

  const handleSave = () => {
    setIsEditing(false)
    // Aqui você faria a chamada para a API para salvar os dados
    console.log('Dados salvos:', userData)
  }

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        setUserData(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Container size="xl">
      <Title order={2} mb="lg">
        Configurações
      </Title>

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
                      <IconPencil style={{ width: rem(16), height: rem(16) }} />
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
                    <Avatar size={120} src={userData.avatar} radius="md">
                      {userData.firstName[0]}
                      {userData.lastName[0]}
                    </Avatar>
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
                      {userData.firstName} {userData.lastName}
                    </Text>
                    <Text c="dimmed">{userData.abordagem}</Text>
                    <Text c="dimmed" size="sm">
                      {userData.crp}
                    </Text>
                  </Stack>
                </Group>

                {/* Form Fields */}
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Nome"
                      value={userData.firstName}
                      onChange={e =>
                        setUserData(prev => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Sobrenome"
                      value={userData.lastName}
                      onChange={e =>
                        setUserData(prev => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Email"
                      type="email"
                      value={userData.email}
                      onChange={e =>
                        setUserData(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Telefone"
                      value={userData.phone}
                      onChange={e =>
                        setUserData(prev => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="CRP"
                      value={userData.crp}
                      onChange={e =>
                        setUserData(prev => ({ ...prev, crp: e.target.value }))
                      }
                      disabled={!isEditing}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Abordagem"
                      value={userData.abordagem}
                      onChange={value =>
                        setUserData(prev => ({
                          ...prev,
                          abordagem: value || '',
                        }))
                      }
                      disabled={!isEditing}
                      data={[
                        'Psicanálise',
                        'Terapia Cognitivo-Comportamental (TCC)',
                        'Gestalt-terapia',
                        'Humanista',
                        'Psicologia Analítica',
                      ]}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Biografia Profissional"
                      description="Esta informação será exibida em seu perfil público"
                      rows={4}
                      value={userData.bio}
                      onChange={e =>
                        setUserData(prev => ({ ...prev, bio: e.target.value }))
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
                        value={userData.endereco.cep}
                        onChange={e =>
                          setUserData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, cep: e.target.value },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 8 }}>
                      <TextInput
                        label="Rua e Número"
                        value={userData.endereco.rua}
                        onChange={e =>
                          setUserData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, rua: e.target.value },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Bairro"
                        value={userData.endereco.bairro}
                        onChange={e =>
                          setUserData(prev => ({
                            ...prev,
                            endereco: {
                              ...prev.endereco,
                              bairro: e.target.value,
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                      <TextInput
                        label="Cidade"
                        value={userData.endereco.cidade}
                        onChange={e =>
                          setUserData(prev => ({
                            ...prev,
                            endereco: {
                              ...prev.endereco,
                              cidade: e.target.value,
                            },
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 2 }}>
                      <Select
                        label="Estado"
                        value={userData.endereco.estado}
                        onChange={value =>
                          setUserData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, estado: value || '' },
                          }))
                        }
                        disabled={!isEditing}
                        data={['SP', 'RJ', 'MG', 'RS', 'PR', 'SC']}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <TextInput
                        label="Complemento"
                        placeholder="Sala, andar, bloco..."
                        value={userData.endereco.complemento}
                        onChange={e =>
                          setUserData(prev => ({
                            ...prev,
                            endereco: {
                              ...prev.endereco,
                              complemento: e.target.value,
                            },
                          }))
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
}
