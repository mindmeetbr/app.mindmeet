import type { PerfilPsicologo } from '../../../../api/models'
import { useState, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useQueryClient } from '@tanstack/react-query'
import { usePerfilPsicologoUpdate } from '../../../../api/endpoints/users/users'
import { notifications } from '@mantine/notifications'
import {
  Card,
  Stack,
  Alert,
  Group,
  Grid,
  TextInput,
  Input,
  Checkbox,
  Divider,
} from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { SecaoHeader } from './SecaoHeader'
import { BotoesEdicao } from './BotoesEdicao.'
export function AbaPerfil({
  dadosPerfil,
  vinculado,
}: {
  dadosPerfil: PerfilPsicologo | undefined
  vinculado: boolean
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const form = useForm({
    initialValues: {
      crp: dadosPerfil?.crp ?? '',
      is_estagiario: dadosPerfil?.is_estagiario ?? false,
      supervisor: dadosPerfil?.supervisor ?? '',
    },
  })

  useEffect(() => {
    if (!dadosPerfil) return
    form.setValues({
      crp: dadosPerfil.crp ?? '',
      is_estagiario: dadosPerfil.is_estagiario ?? false,
      supervisor: dadosPerfil.supervisor ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dadosPerfil])

  const { mutate: atualizarPerfil } = usePerfilPsicologoUpdate()

  const handleSave = () => {
    const payload = {
      crp: form.values.crp,
      ...(vinculado && {
        is_estagiario: form.values.is_estagiario,
        ...(form.values.is_estagiario && {
          supervisor: form.values.supervisor,
        }),
      }),
    }

    atualizarPerfil(
      { data: payload },
      {
        onSuccess: () => {
          setIsEditing(false)
          queryClient.invalidateQueries({ queryKey: ['dados-perfil'] })
          notifications.show({
            title: 'Perfil atualizado!',
            message: 'Seus dados profissionais foram salvos com sucesso.',
            color: 'green',
          })
        },
        onError: () => {
          notifications.show({
            title: 'Erro ao salvar',
            message: 'Não foi possível atualizar seu perfil. Tente novamente.',
            color: 'red',
          })
        },
      }
    )
  }

  const handleCancelar = () => {
    form.reset()
    setIsEditing(false)
  }

  const desativado = !isEditing || vinculado

  return (
    <Card padding={0}>
      <Stack gap="xl">
        {vinculado && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="orange"
            variant="light"
            title="Edição desativada"
          >
            Você está vinculado a uma instituição. Somente o gestor responsável
            pode editar seus dados de perfil.
          </Alert>
        )}

        {/* Seção — Dados Profissionais */}
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <SecaoHeader
              titulo="Dados Profissionais"
              descricao="Informações do seu registro e atuação profissional"
            />
            {!vinculado && (
              <BotoesEdicao
                isEditing={isEditing}
                onEditar={() => setIsEditing(true)}
                onSalvar={handleSave}
                onCancelar={handleCancelar}
              />
            )}
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                label="CRP"
                placeholder="00/00000"
                description="Número no Conselho Regional de Psicologia"
                key={form.key('crp')}
                disabled={desativado}
                {...form.getInputProps('crp')}
              />
            </Grid.Col>
          </Grid>
        </Stack>

        {/* Seção — Vínculo Institucional (somente para vinculados) */}
        {vinculado && (
          <>
            <Divider />
            <Stack gap="md">
              <SecaoHeader
                titulo="Vínculo Institucional"
                descricao="Informações gerenciadas pela sua instituição"
              />
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Input.Wrapper
                    label="Estagiário?"
                    description="Situação do vínculo institucional"
                  >
                    <Checkbox
                      mt={6}
                      label="É estagiário"
                      key={form.key('is_estagiario')}
                      disabled
                      {...form.getInputProps('is_estagiario', {
                        type: 'checkbox',
                      })}
                    />
                  </Input.Wrapper>
                </Grid.Col>

                {form.values.is_estagiario && (
                  <Grid.Col span={{ base: 12, sm: 8 }}>
                    <TextInput
                      label="Supervisor"
                      description="Email do supervisor responsável"
                      placeholder="supervisor@email.com"
                      key={form.key('supervisor')}
                      disabled
                      {...form.getInputProps('supervisor')}
                    />
                  </Grid.Col>
                )}
              </Grid>
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  )
}
