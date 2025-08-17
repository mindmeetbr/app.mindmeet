import {
  Button,
  Card,
  Center,
  Checkbox,
  Group,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/user/cadastro")({
  component: Cadastro,
});

const mockSupervisores = [
  "Ciro Moura",
  "Jackson Viera",
  "Pedro Guilherme",
  "Sabrina Lílian",
  "Valentina Marques",
];

function Cadastro() {
  const schema = z.object({
    nome: z.string(),
    email: z.email(),
    senha: z.string(),
    crp: z.string(),
    estagiario: z.boolean().optional(),
    supervisor: z.string().optional(),
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      nome: "",
      email: "",
      senha: "",
      crp: "",
      estagiario: false,
      supervisor: "",
    },
    validate: (values) => {
      const result = schema.safeParse(values);
      if (!result.success) {
        return z.treeifyError(result.error);
      }
      return {};
    },
  });

  function handleSubmit(values) {
    // chamar api aqui
    // verificar se deu certo
    // pegar id do usuário
    // router.navigate({ to: '/psicologo/$id', params: {id: idUsuario}})
    // ou router.navigate({ to: '/login'})
    console.log(JSON.stringify(values, null, 2));
  }

  return (
    <Center style={{ height: "100vh" }}>
      <Card radius="lg" padding="lg" withBorder style={{ maxWidth: "800px", width: "100%" }}>
        <Stack align="center" justify="center" gap="md">
          <Text fw="bold" size="xl">
            Cadastro
          </Text>
          <Text>
            Já tem uma conta? <Link to="/login">Faça Login!</Link>
          </Text>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            withAsterisk
            label="Nome completo"
            placeholder="Digite seu nome completo"
            size="md"
            radius="md"
            key={form.key("nome")}
            {...form.getInputProps("nome")}
          />

          <TextInput
            required
            withAsterisk
            label="Email"
            placeholder="Digite seu email"
            size="md"
            radius="md"
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <PasswordInput
            required
            withAsterisk
            label="Senha"
            placeholder="Digite sua senha"
            minLength={8}
            size="md"
            radius="md"
            key={form.key("senha")}
            {...form.getInputProps("senha")}
          />

          <Stack>
            <TextInput
              required
              withAsterisk
              label="CRP"
              placeholder="Digite seu CRP"
              maxLength={10}
              size="md"
              radius="md"
              key={form.key("crp")}
              {...form.getInputProps("crp")}
            />

            <Group gap="lg" justify="center">
              <Checkbox
                label="Estagiário?"
                size="md"
                radius="md"
                key={form.key("estagiario")}
                {...form.getInputProps("estagiario")}
              />
              <Select
                label="Supervisor"
                description="Uma notificação será enviada para o supervisor para que seu cadastro seja concluído"
                placeholder="Selecione seu supervisor"
                searchable
                data={mockSupervisores} // procupar por nome de usuário ou email do supervisor
                disabled={!form.values.estagiario}
                required={form.values.estagiario}
                key={form.key("supervisor")}
                {...form.getInputProps("supervisor")}
              />
            </Group>
          </Stack>

          <Button type="submit" size="lg" mt="md" fullWidth>
            Cadastrar
          </Button>
        </form>
      </Card>
    </Center>
  );
}
