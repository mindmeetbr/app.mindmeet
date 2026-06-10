import type { Paciente } from '../../../../api/models'
import { Grid, Card, Stack, Title, Text } from '@mantine/core'
import dayjs from 'dayjs'

export function PerfilPaciente({ paciente }: { paciente: Paciente }) {
  return (
    <Stack gap="lg">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Dados Pessoais
            </Title>
            <Grid>
              <Grid.Col span={{ base: 6, sm: 4 }}>
                <Text size="sm" fw={500}>
                  Nome completo:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.nome_completo}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 4 }}>
                <Text size="sm" fw={500}>
                  CPF:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.cpf}
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4 }}>
                <Text size="sm" fw={500}>
                  RG:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.rg ? paciente.rg : 'Sem RG cadastrado'}
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4 }}>
                <Text size="sm" fw={500}>
                  Estado Civil:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.estado_civil
                    ? paciente.estado_civil
                    : 'Sem estado civil cadastrado'}
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4 }}>
                <Text size="sm" fw={500}>
                  Profissão:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.profissao
                    ? paciente.profissao
                    : 'Sem profissão cadastrada'}
                </Text>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4 }}>
                <Text size="sm" fw={500}>
                  Data de Nascimento:
                </Text>
                <Text size="sm" c="dimmed">
                  {dayjs(paciente.data_nascimento).format('DD/MM/YYYY')}
                </Text>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Dados para Contato
            </Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Text size="sm" fw={500}>
                  Número de telefone:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.numero_telefone}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Text size="sm" fw={500}>
                  Número de celular:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.numero_celular
                    ? paciente.numero_celular
                    : 'Sem número de celular cadastrado'}
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Text size="sm" fw={500}>
                  Endereço de e-mail:
                </Text>
                <Text size="sm" c="dimmed">
                  {paciente.email}
                </Text>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          {/* Informações Clínicas */}
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Informações Clínicas
            </Title>
            {paciente.informacoes_clinicas ? (
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="sm" fw={500}>
                    Queixa Principal:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.informacoes_clinicas.queixa_principal
                      ? paciente.informacoes_clinicas.queixa_principal
                      : 'Sem queixa principal cadastrada'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="sm" fw={500}>
                    Medicamentos Atuais:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.informacoes_clinicas.medicamentos_atuais
                      ? paciente.informacoes_clinicas.medicamentos_atuais
                      : 'Sem medicamentos cadastrados'}
                  </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Text size="sm" fw={500}>
                    Alergias:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.informacoes_clinicas.alergias
                      ? paciente.informacoes_clinicas.alergias
                      : 'Sem alergias cadastradas'}
                  </Text>
                </Grid.Col>
              </Grid>
            ) : (
              <Text size="sm">Sem informações clínicas cadastradas</Text>
            )}
          </Card>
        </Grid.Col>
        {/* Contato de Emergência */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Contato de Emergência
            </Title>
            {paciente.contato_emergencia ? (
              <Grid>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Nome:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.contato_emergencia.nome
                      ? paciente.contato_emergencia.nome
                      : 'Sem nome para contato de emergência'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Telefone:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.contato_emergencia.numero_telefone
                      ? paciente.contato_emergencia.numero_telefone
                      : 'Sem número para contato de emergência'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Parentesco:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.contato_emergencia.parentesco
                      ? paciente.contato_emergencia.parentesco
                      : 'Sem parentesco para contato de emergência'}
                  </Text>
                </Grid.Col>
              </Grid>
            ) : (
              <Text size="sm">Sem contato de emergência cadastrado</Text>
            )}
          </Card>
        </Grid.Col>
        {/* Endereço */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="xl">
            <Title order={4} mb="md">
              Endereço
            </Title>
            {paciente.endereco ? (
              <Grid>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    CEP:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.endereco.cep ?? 'Não cadastrado'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Rua:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.endereco.rua ?? 'Não cadastrada'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Número:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.endereco.numero ?? 'Não cadastrado'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Complemento:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.endereco.complemento ?? 'Não cadastrado'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Bairro:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.endereco.bairro ?? 'Não cadastrado'}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 6, sm: 4 }}>
                  <Text size="sm" fw={500}>
                    Cidade/UF:
                  </Text>
                  <Text size="sm" c="dimmed">
                    {paciente.endereco.cidade && paciente.endereco.uf
                      ? `${paciente.endereco.cidade} / ${paciente.endereco.uf}`
                      : (paciente.endereco.cidade ??
                        paciente.endereco.uf ??
                        'Não cadastrado')}
                  </Text>
                </Grid.Col>
              </Grid>
            ) : (
              <Text size="sm">Sem endereço cadastrado</Text>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}
