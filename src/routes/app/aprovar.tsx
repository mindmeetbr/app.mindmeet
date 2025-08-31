import { Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router'

type ArgsAprovar = {
  id: string;
  token: string;
}

export const Route = createFileRoute('/app/aprovar')({
  component: RouteComponent,
  validateSearch: (search: Record<string, string>): ArgsAprovar => {
    return {
      id: (search.id as string) || '',
      token: (search.token as string) || ''
    }
  }
})

function RouteComponent() {
  const { id, token } = Route.useSearch();
  const isSuccess = Math.random() > 0.5;
  if (isSuccess) {
    return (
      <>
        <Title order={1} mb="sm">Estagiário aprovado com sucesso!</Title>
        <Text>Você pode fechar essa página agora.</Text>
      </>
    )
  }
  return <div>id={id}, token={token}</div>
}
