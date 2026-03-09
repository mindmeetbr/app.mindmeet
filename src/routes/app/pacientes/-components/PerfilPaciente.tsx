import type { Paciente } from '../../../../api/models'
import {
  Grid,
  Card,
  Stack,
  Avatar,
  Title,
  Text,
  Tooltip,
  Badge,
  Group,
  rem,
} from '@mantine/core'
import { IconPhone, IconMail, IconMapPin } from '@tabler/icons-react'
import dayjs from 'dayjs'

const calcularIdade = (dataNascimento: string) => {
  return dayjs().diff(dayjs(dataNascimento), 'year')
}

export function PerfilPaciente({ paciente }: { paciente: Paciente }) {
  return (
    <Grid>
      <Grid.Col span={{ base: 4 }}>
        <Card withBorder radius="md" p="xl">
          <Stack gap="md" align="center">
            <Avatar size={120} radius="md">
              {paciente.nome_completo
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)}
            </Avatar>

            <div style={{ textAlign: 'center' }}>
              <Title order={3}>{paciente.nome_completo}</Title>
              <Text c="dimmed">
                {calcularIdade(paciente.data_nascimento)} anos
              </Text>
              {paciente?.acompanhado_por && (
                <Tooltip label={`Acompanhado por ${paciente.acompanhado_por}`}>
                  <Badge variant="outline">{paciente.acompanhado_por}</Badge>
                </Tooltip>
              )}
            </div>

            <Stack gap="xs" w="100%">
              <Group gap="xs">
                <IconPhone style={{ width: rem(16), height: rem(16) }} />
                <Text size="sm">{paciente.numero_telefone}</Text>
              </Group>
              {paciente.numero_celular && (
                <Group gap="xs">
                  <IconPhone style={{ width: rem(16), height: rem(16) }} />
                  <Text size="sm">{paciente.numero_celular}</Text>
                </Group>
              )}
              <Group gap="xs">
                <IconMail style={{ width: rem(16), height: rem(16) }} />
                <Text size="sm">{paciente.email}</Text>
              </Group>
              {paciente.endereco?.rua && paciente.endereco.bairro && (
                <Group gap="xs">
                  <IconMapPin style={{ width: rem(16), height: rem(16) }} />
                  <Text size="sm">
                    {paciente.endereco.rua}, {paciente.endereco.bairro}
                  </Text>
                </Group>
              )}
            </Stack>
          </Stack>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="lg">
          {/* Dados Pessoais */}
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Dados Pessoais
            </Title>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  CPF:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.cpf}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  RG:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.rg ? paciente.rg : 'Sem RG cadastrado'}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Estado Civil:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.estado_civil
                    ? paciente.estado_civil
                    : 'Sem estado civil cadastrado'}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>
                  Profissão:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.profissao
                    ? paciente.profissao
                    : 'Sem profissão cadastrada'}
                </Text>
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" fw={500}>
                  Data de Nascimento:
                </Text>
                <Text size="sm" c="dimmed">
                  {dayjs(paciente.data_nascimento).format('DD/MM/YYYY')}
                </Text>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Informações Clínicas */}
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Informações Clínicas
            </Title>
            {paciente.informacoes_clinicas ? (
              <Stack gap="md">
                <div>
                  <Text size="sm" fw={500}>
                    Queixa Principal:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.informacoes_clinicas.queixa_principal
                      ? paciente.informacoes_clinicas.queixa_principal
                      : 'Sem queixa principal cadastrada'}
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>
                    Medicamentos Atuais:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.informacoes_clinicas.medicamentos_atuais
                      ? paciente.informacoes_clinicas.medicamentos_atuais
                      : 'Sem medicamentos cadastrados'}
                  </Text>
                </div>
                <div>
                  <Text size="sm" fw={500}>
                    Alergias:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.informacoes_clinicas.alergias
                      ? paciente.informacoes_clinicas.alergias
                      : 'Sem alergias cadastradas'}
                  </Text>
                </div>
              </Stack>
            ) : (
              <Text size="sm">Sem informações clínicas cadastradas</Text>
            )}
          </Card>

          {/* Contato de Emergência */}
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Contato de Emergência
            </Title>
            {paciente.contato_emergencia ? (
              <Grid>
                <Grid.Col span={8}>
                  <Text size="sm" fw={500}>
                    Nome:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.contato_emergencia.nome
                      ? paciente.contato_emergencia.nome
                      : 'Sem nome para contato de emergência'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="sm" fw={500}>
                    Telefone:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.contato_emergencia.numero_telefone
                      ? paciente.contato_emergencia.numero_telefone
                      : 'Sem número para contato de emergência'}
                  </Text>
                </Grid.Col>
              </Grid>
            ) : (
              <Text size="sm">Sem contato de emergência cadastrado</Text>
            )}
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  )
}
