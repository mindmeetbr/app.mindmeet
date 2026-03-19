import type { MUser } from '../../../../api/models'
import { SexoEnum } from '../../../../api/models'
import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from '@mantine/form'
import { useUsuarioUpdate } from '../../../../api/endpoints/users/users'
import {
  Card,
  Stack,
  Alert,
  Group,
  Grid,
  TextInput,
  Select,
  Divider,
} from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { SecaoHeader } from './SecaoHeader'
import { BotoesEdicao } from './BotoesEdicao.'
import { IconAlertCircle } from '@tabler/icons-react'

const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export function AbaConta({
  dadosUsuario,
  vinculado,
}: {
  dadosUsuario: MUser | undefined
  vinculado: boolean
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const form = useForm({
    initialValues: {
      nome_completo: dadosUsuario?.nome_completo ?? '',
      email: dadosUsuario?.email ?? '',
      cpf: dadosUsuario?.cpf ?? '',
      data_nascimento: dadosUsuario?.data_nascimento ?? '',
      numero_telefone: dadosUsuario?.numero_telefone ?? '',
      sexo: dadosUsuario?.sexo ?? '',
      endereco: {
        cep: dadosUsuario?.endereco?.cep ?? '',
        rua: dadosUsuario?.endereco?.rua ?? '',
        numero: dadosUsuario?.endereco?.numero ?? '',
        complemento: dadosUsuario?.endereco?.complemento ?? '',
        bairro: dadosUsuario?.endereco?.bairro ?? '',
        cidade: dadosUsuario?.endereco?.cidade ?? '',
        uf: dadosUsuario?.endereco?.uf ?? '',
      },
    },
  })

  useEffect(() => {
    if (!dadosUsuario) return
    form.setValues({
      nome_completo: dadosUsuario.nome_completo ?? '',
      email: dadosUsuario.email ?? '',
      cpf: dadosUsuario.cpf ?? '',
      data_nascimento: dadosUsuario.data_nascimento ?? '',
      numero_telefone: dadosUsuario.numero_telefone ?? '',
      sexo: dadosUsuario.sexo ?? '',
      endereco: {
        cep: dadosUsuario.endereco?.cep ?? '',
        rua: dadosUsuario.endereco?.rua ?? '',
        numero: dadosUsuario.endereco?.numero ?? '',
        complemento: dadosUsuario.endereco?.complemento ?? '',
        bairro: dadosUsuario.endereco?.bairro ?? '',
        cidade: dadosUsuario.endereco?.cidade ?? '',
        uf: dadosUsuario.endereco?.uf ?? '',
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dadosUsuario])

  const opcoesSexo = [
    { value: SexoEnum.M, label: 'Masculino' },
    { value: SexoEnum.F, label: 'Feminino' },
    { value: SexoEnum.O, label: 'Outro / Prefiro não dizer' },
  ]

  const { mutate: atualizarUsuario } = useUsuarioUpdate()

  const handleSave = () => {
    atualizarUsuario(
      { data: form.values },
      {
        onSuccess: () => {
          setIsEditing(false)
          queryClient.invalidateQueries({ queryKey: ['dados-usuario'] })
          notifications.show({
            title: 'Dados atualizados!',
            message: 'Suas informações pessoais foram salvas com sucesso.',
            color: 'green',
          })
        },
        onError: () => {
          notifications.show({
            title: 'Erro ao salvar',
            message: 'Não foi possível atualizar seus dados. Tente novamente.',
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
            pode editar seus dados.
          </Alert>
        )}

        {/* Seção — Dados Pessoais */}
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <SecaoHeader
              titulo="Dados Pessoais"
              descricao="Informações básicas da sua conta"
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
            <Grid.Col span={12}>
              <TextInput
                label="Nome completo"
                placeholder="Seu nome completo"
                key={form.key('nome_completo')}
                disabled={desativado}
                {...form.getInputProps('nome_completo')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Email"
                type="email"
                placeholder="Seu endereço de email"
                key={form.key('email')}
                disabled={desativado}
                {...form.getInputProps('email')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="CPF"
                placeholder="000.000.000-00"
                key={form.key('cpf')}
                disabled={desativado}
                {...form.getInputProps('cpf')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="Telefone"
                placeholder="(00) 00000-0000"
                key={form.key('numero_telefone')}
                disabled={desativado}
                {...form.getInputProps('numero_telefone')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 3 }}>
              <DateInput
                label="Data de nascimento"
                placeholder="DD/MM/AAAA"
                valueFormat="DD/MM/YYYY"
                locale="pt-br"
                key={form.key('data_nascimento')}
                disabled={desativado}
                {...form.getInputProps('data_nascimento')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 3 }}>
              <Select
                label="Sexo"
                placeholder="Selecione"
                data={opcoesSexo}
                key={form.key('sexo')}
                disabled={desativado}
                {...form.getInputProps('sexo')}
              />
            </Grid.Col>
          </Grid>
        </Stack>

        <Divider />

        {/* Seção — Endereço */}
        <Stack gap="md">
          <SecaoHeader
            titulo="Endereço"
            descricao="Endereço associado ao seu consultório ou residência"
          />

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 3 }}>
              <TextInput
                label="CEP"
                placeholder="00000-000"
                disabled={desativado}
                {...form.getInputProps('endereco.cep')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 7 }}>
              <TextInput
                label="Rua"
                placeholder="Nome da rua ou avenida"
                disabled={desativado}
                {...form.getInputProps('endereco.rua')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 2 }}>
              <TextInput
                label="Número"
                placeholder="Nº"
                disabled={desativado}
                {...form.getInputProps('endereco.numero')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                label="Bairro"
                disabled={desativado}
                {...form.getInputProps('endereco.bairro')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                label="Cidade"
                disabled={desativado}
                {...form.getInputProps('endereco.cidade')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 2 }}>
              <Select
                label="UF"
                placeholder="UF"
                disabled={desativado}
                data={UFS}
                {...form.getInputProps('endereco.uf')}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <TextInput
                label="Complemento"
                placeholder="Sala, andar, bloco..."
                disabled={desativado}
                {...form.getInputProps('endereco.complemento')}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>
    </Card>
  )
}
