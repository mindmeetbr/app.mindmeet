import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { 
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Textarea,
  Select,
  Grid,
  rem,
  Divider,
  Title
} from '@mantine/core'
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { PageLayout } from '../../../components/layout'

export const Route = createFileRoute('/app/pacientes/novo')({
  component: NovoPacientePage,
  validateSearch: (search: Record<string, unknown>) => ({
    id: search.id as string | undefined,
  }),
})

// Mock data para edição - em uma aplicação real, você buscaria os dados pela ID
const mockPacienteData = {
  '1': {
    nome: 'Maria Silva Santos',
    email: 'maria.santos@email.com',
    telefone: '(11) 99999-1111',
    celular: '(11) 88888-1111',
    dataNascimento: '1985-03-15',
    cpf: '123.456.789-01',
    rg: '12.345.678-9',
    estadoCivil: 'Casada',
    profissao: 'Enfermeira',
    cep: '01234-567',
    endereco: 'Rua das Flores, 123',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    queixaPrincipal: 'Ansiedade generalizada com episódios de pânico',
    historicoPsiquiatrico: 'Primeira vez em tratamento psicológico',
    medicamentosAtual: 'Sertralina 50mg (1x ao dia)',
    alergias: 'Dipirona',
    nomeEmergencia: 'João Santos',
    telefoneEmergencia: '(11) 99999-2222',
    parentescoEmergencia: 'Cônjuge',
    motivoConsulta: 'Episódios de ansiedade e pânico no trabalho, dificuldade para dormir',
    expectativas: 'Aprender a controlar a ansiedade e melhorar qualidade do sono',
    historiaDoencaAtual: 'Sintomas iniciaram há 6 meses após mudança de setor no trabalho',
    historicoFamiliar: 'Mãe com histórico de depressão',
    antecedentePsiquiatrico: 'Nenhum',
    usoSubstancias: 'Eventual consumo de álcool socialmente',
    observacoes: 'Paciente muito colaborativa, demonstra insight sobre sua condição'
  }
}

function NovoPacientePage() {
  const router = useRouter()
  const search = useSearch({ from: '/app/pacientes/novo' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isEditing = !!search.id
  const pacienteId = search.id

  const getInitialValues = () => {
    const defaultValues = {
      // Dados Pessoais
      nome: '',
      email: '',
      telefone: '',
      celular: '',
      dataNascimento: '',
      cpf: '',
      rg: '',
      estadoCivil: '',
      profissao: '',
      
      // Endereço
      cep: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      
      // Informações Clínicas
      queixaPrincipal: '',
      historicoPsiquiatrico: '',
      medicamentosAtual: '',
      alergias: '',
      
      // Contato de Emergência
      nomeEmergencia: '',
      telefoneEmergencia: '',
      parentescoEmergencia: '',
      
      // Anamnese
      motivoConsulta: '',
      expectativas: '',
      historiaDoencaAtual: '',
      historicoFamiliar: '',
      antecedentePsiquiatrico: '',
      usoSubstancias: '',
      
      // Observações
      observacoes: ''
    }

    if (isEditing && pacienteId && mockPacienteData[pacienteId as keyof typeof mockPacienteData]) {
      return mockPacienteData[pacienteId as keyof typeof mockPacienteData]
    }

    return defaultValues
  }

  const form = useForm({
    initialValues: getInitialValues(),
    validate: {
      nome: (value) => (!value ? 'Nome é obrigatório' : null),
      email: (value) => (!value ? 'Email é obrigatório' : /^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      telefone: (value) => (!value ? 'Telefone é obrigatório' : null),
      dataNascimento: (value) => (!value ? 'Data de nascimento é obrigatória' : null),
      cpf: (value) => (!value ? 'CPF é obrigatório' : null),
    }
  })

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true)
    try {
      if (isEditing) {
        console.log('Atualizando paciente:', pacienteId, values)
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Redirecionar para a página de detalhes do paciente
        router.navigate({ to: '/app/pacientes/$id', params: { id: pacienteId! } })
      } else {
        console.log('Cadastrando paciente:', values)
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Redirecionar para a lista de pacientes
        router.navigate({ to: '/app/pacientes' })
      }
    } catch (error) {
      console.error('Erro ao salvar paciente:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPacienteName = () => {
    if (isEditing && pacienteId && mockPacienteData[pacienteId as keyof typeof mockPacienteData]) {
      return mockPacienteData[pacienteId as keyof typeof mockPacienteData].nome
    }
    return ''
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Pacientes', href: '/app/pacientes' }
    ]

    if (isEditing) {
      breadcrumbs.push({ 
        label: getPacienteName(), 
        onClick: () => router.navigate({ to: '/app/pacientes/$id', params: { id: pacienteId! } })
      })
    }

    breadcrumbs.push({ 
      label: isEditing ? 'Editar' : 'Novo Paciente', 
      isCurrentPage: true 
    })

    return breadcrumbs
  }

  return (
    <PageLayout
      containerSize="lg"
      breadcrumbs={getBreadcrumbs()}
      title={isEditing ? `Editando: ${getPacienteName()}` : 'Novo Paciente'}
      description={isEditing 
        ? 'Atualize as informações do paciente abaixo'
        : 'Preencha as informações para cadastrar um novo paciente'
      }
      secondaryAction={{
        label: 'Voltar',
        icon: <IconArrowLeft style={{ width: rem(16), height: rem(16) }} />,
        variant: 'subtle',
        onClick: () => isEditing 
          ? router.navigate({ to: '/app/pacientes/$id', params: { id: pacienteId! } })
          : router.navigate({ to: '/app/pacientes' })
      }}
    >

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
            {/* Dados Pessoais */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Title order={4}>Dados Pessoais</Title>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <TextInput
                      label="Nome Completo"
                      placeholder="Nome do paciente"
                      required
                      {...form.getInputProps('nome')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label="Data de Nascimento"
                      type="date"
                      required
                      {...form.getInputProps('dataNascimento')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Email"
                      type="email"
                      placeholder="email@exemplo.com"
                      required
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      label="Telefone"
                      placeholder="(11) 99999-9999"
                      required
                      {...form.getInputProps('telefone')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      label="Celular"
                      placeholder="(11) 99999-9999"
                      {...form.getInputProps('celular')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label="CPF"
                      placeholder="000.000.000-00"
                      required
                      {...form.getInputProps('cpf')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label="RG"
                      placeholder="00.000.000-0"
                      {...form.getInputProps('rg')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Select
                      label="Estado Civil"
                      placeholder="Selecione"
                      data={['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']}
                      {...form.getInputProps('estadoCivil')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <TextInput
                      label="Profissão"
                      placeholder="Profissão do paciente"
                      {...form.getInputProps('profissao')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Endereço */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Title order={4}>Endereço</Title>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      label="CEP"
                      placeholder="00000-000"
                      {...form.getInputProps('cep')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Endereço"
                      placeholder="Rua, Avenida..."
                      {...form.getInputProps('endereco')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      label="Número"
                      placeholder="123"
                      {...form.getInputProps('numero')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label="Complemento"
                      placeholder="Apto, Bloco..."
                      {...form.getInputProps('complemento')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label="Bairro"
                      placeholder="Nome do bairro"
                      {...form.getInputProps('bairro')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      label="Cidade"
                      placeholder="Nome da cidade"
                      {...form.getInputProps('cidade')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 1 }}>
                    <Select
                      label="UF"
                      placeholder="SP"
                      data={['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'GO', 'MT', 'MS', 'BA', 'PE', 'CE']}
                      {...form.getInputProps('estado')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Informações Clínicas */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Title order={4}>Informações Clínicas</Title>
                
                <Textarea
                  label="Queixa Principal"
                  placeholder="Descreva a queixa principal do paciente..."
                  rows={3}
                  {...form.getInputProps('queixaPrincipal')}
                />
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Textarea
                      label="Histórico Psiquiátrico"
                      placeholder="Histórico de tratamentos anteriores..."
                      rows={3}
                      {...form.getInputProps('historicoPsiquiatrico')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Textarea
                      label="Medicamentos Atuais"
                      placeholder="Medicamentos em uso..."
                      rows={3}
                      {...form.getInputProps('medicamentosAtual')}
                    />
                  </Grid.Col>
                </Grid>
                
                <TextInput
                  label="Alergias"
                  placeholder="Alergias conhecidas..."
                  {...form.getInputProps('alergias')}
                />
              </Stack>
            </Card>

            {/* Contato de Emergência */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Title order={4}>Contato de Emergência</Title>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label="Nome"
                      placeholder="Nome do contato"
                      {...form.getInputProps('nomeEmergencia')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      label="Telefone"
                      placeholder="(11) 99999-9999"
                      {...form.getInputProps('telefoneEmergencia')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      label="Parentesco"
                      placeholder="Selecione"
                      data={['Pai', 'Mãe', 'Cônjuge', 'Filho(a)', 'Irmão(ã)', 'Amigo(a)', 'Outro']}
                      {...form.getInputProps('parentescoEmergencia')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Anamnese */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Title order={4}>Anamnese</Title>
                
                <Textarea
                  label="Motivo da Consulta"
                  placeholder="Por que o paciente procurou ajuda psicológica?"
                  rows={3}
                  {...form.getInputProps('motivoConsulta')}
                />
                
                <Textarea
                  label="Expectativas"
                  placeholder="O que o paciente espera do tratamento?"
                  rows={2}
                  {...form.getInputProps('expectativas')}
                />
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Textarea
                      label="História da Doença Atual"
                      placeholder="Como iniciaram os sintomas..."
                      rows={4}
                      {...form.getInputProps('historiaDoencaAtual')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Textarea
                      label="Histórico Familiar"
                      placeholder="Histórico de doenças mentais na família..."
                      rows={4}
                      {...form.getInputProps('historicoFamiliar')}
                    />
                  </Grid.Col>
                </Grid>
                
                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Textarea
                      label="Antecedentes Psiquiátricos"
                      placeholder="Tratamentos anteriores, internações..."
                      rows={3}
                      {...form.getInputProps('antecedentePsiquiatrico')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <Textarea
                      label="Uso de Substâncias"
                      placeholder="Álcool, drogas, tabaco..."
                      rows={3}
                      {...form.getInputProps('usoSubstancias')}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Observações */}
            <Card withBorder radius="md" p="xl">
              <Stack gap="md">
                <Title order={4}>Observações Gerais</Title>
                
                <Textarea
                  label="Observações"
                  placeholder="Outras informações relevantes..."
                  rows={4}
                  {...form.getInputProps('observacoes')}
                />
              </Stack>
            </Card>

            {/* Botões de Ação */}
            <Group justify="flex-end" gap="md">
              <Button 
                variant="outline" 
                onClick={() => isEditing 
                  ? router.navigate({ to: '/app/pacientes/$id', params: { id: pacienteId! } })
                  : router.navigate({ to: '/app/pacientes' })
                }
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                leftSection={<IconDeviceFloppy style={{ width: rem(16), height: rem(16) }} />}
                loading={isSubmitting}
              >
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
              </Button>
          </Group>
        </Stack>
      </form>
    </PageLayout>
  )
}