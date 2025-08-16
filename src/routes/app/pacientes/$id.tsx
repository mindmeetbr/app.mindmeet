import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Title,
  Card,
  Stack,
  Group,
  Button,
  Text,
  Badge,
  Avatar,
  Grid,
  Divider,
  Timeline,
  Textarea,
  ActionIcon,
  rem,
  Tabs,
  Modal,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { DatesProvider, DatePickerInput, TimeInput } from "@mantine/dates";
import {
  IconEdit,
  IconCalendar,
  IconPhone,
  IconMail,
  IconMapPin,
  IconUser,
  IconClockHour3,
  IconNotes,
  IconDeviceFloppy,
  IconPencil,
} from "@tabler/icons-react";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { PageLayout } from "../../../components/layout";
import {
  useAnotacaoList,
  useAnotacaoUpdate,
  useAnotacaoCreate,
} from "../../../api/endpoints/api/api";
import type { Anotacao } from "../../../api/models/anotacao";

export const Route = createFileRoute("/app/pacientes/$id")({
  component: PacienteDetalhePage,
});

const mockPaciente = {
  id: 1,
  nome: "Maria Silva Santos",
  email: "maria.santos@email.com",
  telefone: "(11) 99999-1111",
  celular: "(11) 88888-1111",
  dataNascimento: "1985-03-15",
  cpf: "123.456.789-01",
  rg: "12.345.678-9",
  estadoCivil: "Casada",
  profissao: "Enfermeira",
  endereco: {
    cep: "01234-567",
    rua: "Rua das Flores, 123",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    complemento: "Apto 45",
  },
  status: "ativo",
  queixaPrincipal: "Ansiedade generalizada com episódios de pânico",
  historicoPsiquiatrico: "Primeira vez em tratamento psicológico",
  medicamentosAtual: "Sertralina 50mg (1x ao dia)",
  alergias: "Dipirona",
  emergencia: {
    nome: "João Santos (Esposo)",
    telefone: "(11) 99999-2222",
    parentesco: "Cônjuge",
  },
  anamnese: {
    motivoConsulta:
      "Episódios de ansiedade e pânico no trabalho, dificuldade para dormir",
    expectativas:
      "Aprender a controlar a ansiedade e melhorar qualidade do sono",
    historiaDoencaAtual:
      "Sintomas iniciaram há 6 meses após mudança de setor no trabalho",
    historicoFamiliar: "Mãe com histórico de depressão",
    antecedentePsiquiatrico: "Nenhum",
    usoSubstancias: "Eventual consumo de álcool socialmente",
  },
  observacoes:
    "Paciente muito colaborativa, demonstra insight sobre sua condição",
};

function BotaoNovaConsulta() {
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = Route.useParams();
  const { mutate } = useAnotacaoCreate();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      titulo: "",
      descricao: "",
      data: null,
      hora: null,
      apresentada: "",
      identificada: "",
    },
  });


  function handleSubmit(values) {
    const dataStr = values.data?.trim() || null;
    const horaStr = values.hora?.trim() || "";
    let datetimeFinal = new Date().toISOString();

    if (dataStr && horaStr) {
      let [hh, mm] = horaStr.split(":").map((v) => v.padStart(2, "0"));
      mm = mm || "00";
      datetimeFinal = `${dataStr}T${hh}:${mm}:00`;
    } else if (dataStr) {
      datetimeFinal = dataStr;
    }

    const dados = {
      paciente: id,
      data: {
        titulo: values.titulo,
        descricao: values.descricao,
        queixaApresentada: values.apresentada,
        queixaIdentificada: values.identificada,
        data: datetimeFinal,
      },
    };
    mutate(dados, {
      onSuccess: () => {
        notifications.show({
          title: "Sucesso!",
          message: "Nova anotação criada com sucesso",
          color: "green",
        });
        form.reset();
        close();
      },
      onError: () => {
        notifications.show({
          title: "Erro!",
          message: "Não foi possível criar a anotação, tente novamente",
          color: "red",
        });
      },
    });
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Nova anotação"
        centered
        size="70%"
        radius="md"
        overlayProps={{
          blur: 2,
          backgroundOpacity: 0.5,
        }}
        styles={{
          title: { fontSize: 20, fontWeight: 600 },
          header: { paddingBottom: 12 },
          body: { paddingTop: 8, paddingBottom: 16 },
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              withAsterisk
              required
              label="Título"
              placeholder="Título da anotação"
              radius="md"
              size="md"
              leftSection={<IconNotes size={18} />}
              key={form.key("titulo")}
              {...form.getInputProps("titulo")}
            />

            <TextInput
              label="Descrição"
              placeholder="Descrição da anotação"
              radius="md"
              size="md"
              leftSection={<IconNotes size={18} />}
              key={form.key("descricao")}
              {...form.getInputProps("descricao")}
            />

            <DatesProvider settings={{ locale: "pt-br" }}>
              <Group grow align="flex-end">
                <DatePickerInput
                  label="Data"
                  placeholder="Selecione uma data"
                  defaultDate={new Date()}
                  size="md"
                  radius="md"
                  leftSection={<IconCalendar size={18} />}
                  key={form.key("data")}
                  {...form.getInputProps("data")}
                />

                <TimeInput
                  label="Hora"
                  placeholder="Selecione a hora"
                  radius="md"
                  size="md"
                  leftSection={<IconClockHour3 size={18} />}
                  key={form.key("hora")}
                  {...form.getInputProps("hora")}
                />
              </Group>
            </DatesProvider>

            <Textarea
              label="Queixa Apresentada"
              placeholder="..."
              radius="md"
              autosize
              minRows={3}
              key={form.key("apresentada")}
              {...form.getInputProps("apresentada")}
            />

            <Textarea
              label="Queixa Identificada"
              placeholder="..."
              radius="md"
              autosize
              minRows={3}
              key={form.key("identificada")}
              {...form.getInputProps("identificada")}
            />

            <Group mt="sm">
              <Button type="submit" radius="md" size="md">
                Salvar
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Button
        leftSection={
          <IconCalendar style={{ width: rem(16), height: rem(16) }} />
        }
        onClick={open}
      >
        Nova Anotação
      </Button>
    </>
  );
}

function PacienteDetalhePage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("perfil");
  const [editingConsultaId, setEditingConsultaId] = useState<number | null>(
    null,
  );
  const [descTemp, setDescTemp] = useState("");
  const [apresentadaTemp, setApresentadaTemp] = useState("");
  const [identificadaTemp, setIdentificadaTemp] = useState("");

  const { data, isLoading } = useAnotacaoList(id);

  const { mutate } = useAnotacaoUpdate();

  const calcularIdade = (dataNascimento: string) => {
    return dayjs().diff(dayjs(dataNascimento), "year");
  };

  const handleEditConsulta = (consulta: Anotacao) => {
    setEditingConsultaId(consulta.id);
    setDescTemp(consulta.descricao ? consulta.descricao : "");
    setApresentadaTemp(
      consulta.queixa_apresentada ? consulta.queixa_apresentada? : "",
    );
    setIdentificadaTemp(
      consulta.queixa_identificada ? consulta.queixa_identificada : "",
    );
  };

  const handleSaveConsulta = (consultaId: number) => {
    mutate({
      paciente: id,
      pkAnotacao: consultaId,
      data: {
        descricao: descTemp,
        queixa_apresentada: apresentadaTemp,
        queixa_identificada: identificadaTemp,
      },
    });

    setEditingConsultaId(null);
    setDescTemp("");
    setApresentadaTemp("");
    setIdentificadaTemp("");

    notifications.show({
      title: "Anotação editada com sucesso!",
      message: "Recarregue a página para ver as alterações",
    });
  };

  const handleCancelEdit = () => {
    setEditingConsultaId(null);
    setDescTemp("");
    setApresentadaTemp("");
    setIdentificadaTemp("");
  };

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Pacientes", href: "/app/pacientes" },
        { label: mockPaciente.nome, isCurrentPage: true },
      ]}
      title={mockPaciente.nome}
      primaryAction={{
        label: "Editar",
        icon: <IconEdit style={{ width: rem(16), height: rem(16) }} />,
        variant: "light",
        onClick: () =>
          router.navigate({ to: "/app/pacientes/novo", search: { id } }),
      }}
      headerChildren={
        <Group gap="md" mt="xs">
          <Avatar size={60} radius="md">
            {mockPaciente.nome
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </Avatar>
          <Group gap="md">
            <Badge
              color={mockPaciente.status === "ativo" ? "green" : "gray"}
              variant="light"
            >
              {mockPaciente.status}
            </Badge>
            <Text size="sm" c="dimmed">
              {calcularIdade(mockPaciente.dataNascimento)} anos
            </Text>
            <Text size="sm" c="dimmed">
              CPF: {mockPaciente.cpf}
            </Text>
          </Group>
        </Group>
      }
    >
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab
            value="perfil"
            leftSection={
              <IconUser style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Perfil
          </Tabs.Tab>
          <Tabs.Tab
            value="consultas"
            leftSection={
              <IconCalendar style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Consultas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="perfil" pt="lg">
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder radius="md" p="xl">
                <Stack gap="md" align="center">
                  <Avatar size={120} radius="md">
                    {mockPaciente.nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </Avatar>

                  <div style={{ textAlign: "center" }}>
                    <Title order={3}>{mockPaciente.nome}</Title>
                    <Text c="dimmed">
                      {calcularIdade(mockPaciente.dataNascimento)} anos
                    </Text>
                    <Badge
                      color={mockPaciente.status === "ativo" ? "green" : "gray"}
                      mt="xs"
                    >
                      {mockPaciente.status}
                    </Badge>
                  </div>

                  <Stack gap="xs" w="100%">
                    <Group gap="xs">
                      <IconPhone style={{ width: rem(16), height: rem(16) }} />
                      <Text size="sm">{mockPaciente.telefone}</Text>
                    </Group>
                    {mockPaciente.celular && (
                      <Group gap="xs">
                        <IconPhone
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <Text size="sm">{mockPaciente.celular}</Text>
                      </Group>
                    )}
                    <Group gap="xs">
                      <IconMail style={{ width: rem(16), height: rem(16) }} />
                      <Text size="sm">{mockPaciente.email}</Text>
                    </Group>
                    <Group gap="xs">
                      <IconMapPin style={{ width: rem(16), height: rem(16) }} />
                      <Text size="sm">
                        {mockPaciente.endereco.rua},{" "}
                        {mockPaciente.endereco.bairro}
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap="lg">
                {/* Dados Pessoais }
                  <Card withBorder radius="md" p="xl">
                    <Title order={4} mb="md">Dados Pessoais</Title>
                    <Grid>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>CPF:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.cpf}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>RG:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.rg}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>Estado Civil:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.estadoCivil}</Text>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="sm" fw={500}>Profissão:</Text>
                        <Text size="sm" c="dimmed">{mockPaciente.profissao}</Text>
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <Text size="sm" fw={500}>Data de Nascimento:</Text>
                        <Text size="sm" c="dimmed">
                          {dayjs(mockPaciente.dataNascimento).format('DD/MM/YYYY')}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Card>

                  {/* Informações Clínicas */}
                <Card withBorder radius="md" p="xl">
                  <Title order={4} mb="md">
                    Informações Clínicas
                  </Title>
                  <Stack gap="md">
                    <div>
                      <Text size="sm" fw={500}>
                        Queixa Principal:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {mockPaciente.queixaPrincipal}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" fw={500}>
                        Medicamentos Atuais:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {mockPaciente.medicamentosAtual}
                      </Text>
                    </div>
                    <div>
                      <Text size="sm" fw={500}>
                        Alergias:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {mockPaciente.alergias}
                      </Text>
                    </div>
                  </Stack>
                </Card>

                {/* Contato de Emergência */}
                <Card withBorder radius="md" p="xl">
                  <Title order={4} mb="md">
                    Contato de Emergência
                  </Title>
                  <Grid>
                    <Grid.Col span={8}>
                      <Text size="sm" fw={500}>
                        Nome:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {mockPaciente.emergencia.nome}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text size="sm" fw={500}>
                        Telefone:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {mockPaciente.emergencia.telefone}
                      </Text>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="consultas" pt="lg">
          <Card withBorder radius="md" p="xl">
            <Group justify="space-between" mb="lg">
              <Title order={4}>Linha do Tempo das Consultas</Title>
              <BotaoNovaConsulta />
            </Group>

            {!isLoading && (
              <Timeline active={data.length} bulletSize={24} lineWidth={2}>
                {data.map((consulta: Anotacao, index) => (
                  <Timeline.Item
                    key={consulta.id}
                    bullet={
                      <IconClockHour3
                        style={{ width: rem(12), height: rem(12) }}
                      />
                    }
                    title={
                      <Group justify="space-between">
                        <div>
                          <Text fw={500}>{consulta.tipo}</Text>
                          <Text size="sm" c="dimmed">
                            {dayjs(consulta.data).format(
                              "DD/MM/YYYY[ - ]HH:mm",
                            )}
                          </Text>
                        </div>
                        <ActionIcon
                          variant="light"
                          size="sm"
                          onClick={() => handleEditConsulta(consulta)}
                        >
                          <IconPencil
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        </ActionIcon>
                      </Group>
                    }
                  >
                    <Stack gap="md" mt="sm">
                      <div>
                        <Text size="md" fw="bold" mb="xs">
                          {consulta.titulo}
                        </Text>
                        {editingConsultaId === consulta.id ? (
                          <Textarea
                            value={descTemp}
                            onChange={(e) => setDescTemp(e.target.value)}
                            rows={3}
                            placeholder="Descrição da sessão..."
                          />
                        ) : (
                          <Text size="sm" c="dimmed">
                            {consulta.descricao
                              ? consulta.descricao
                              : "Sem descrição"}
                          </Text>
                        )}
                      </div>

                      <div>
                        <Text size="sm" fw={500} mb="xs">
                          Queixa Apresentada:
                        </Text>
                        {editingConsultaId === consulta.id ? (
                          <Textarea
                            value={apresentadaTemp}
                            onChange={(e) => setApresentadaTemp(e.target.value)}
                            rows={3}
                            placeholder="Queixa apresentada..."
                          />
                        ) : (
                          <Text size="sm" c="dimmed">
                            {consulta.queixa_apresentada
                              ? consulta.queixa_apresentada
                              : "Nenhuma queixa apresentada."}
                          </Text>
                        )}
                      </div>

                      <div>
                        <Text size="sm" fw={500} mb="xs">
                          Queixa Identificada:
                        </Text>
                        {editingConsultaId === consulta.id ? (
                          <Stack>
                            <Textarea
                              value={identificadaTemp}
                              onChange={(e) =>
                                setIdentificadaTemp(e.target.value)
                              }
                              rows={3}
                              placeholder="Queixa identificada..."
                            />
                            <Group>
                              <Button
                                size="xs"
                                leftSection={
                                  <IconDeviceFloppy
                                    style={{ width: rem(12), height: rem(12) }}
                                  />
                                }
                                onClick={() => handleSaveConsulta(consulta.id)}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                Cancelar
                              </Button>
                            </Group>
                          </Stack>
                        ) : (
                          <Text size="sm" c="dimmed">
                            {consulta.queixa_identificada
                              ? consulta.queixa_identificada
                              : "Nenhuma queixa identificada."}
                          </Text>
                        )}
                      </div>
                    </Stack>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>
    </PageLayout>
  );
}
