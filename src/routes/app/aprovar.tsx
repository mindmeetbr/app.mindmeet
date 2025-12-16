import { Text, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useAprovarEstagiario } from '../../api/endpoints/users/users'

type ArgsAprovar = {
  id: string
  token: string
}

export const Route = createFileRoute('/app/aprovar')({
  component: PaginaAprovacao,
  validateSearch: (search: Record<string, string>): ArgsAprovar => {
    return {
      id: (search.id as string) || '',
      token: (search.token as string) || '',
    }
  },
})

function PaginaAprovacao() {
  const { id, token } = Route.useSearch()
  const { data, isLoading, isError, isSuccess } = useAprovarEstagiario(
    id,
    token
  )

  if (isLoading) {
    return <Text>Carregando...</Text>
  }

  if (isError) {
    return (
      <>
        <Title order={1} mb="sm">
          Erro!
        </Title>
        <Text>Não foi possível aprovar o estagiário, tente novamente.</Text>
      </>
    )
  }

  if (isSuccess) {
    return (
      <>
        <Title order={1} mb="sm">
          Estagiário aprovado com sucesso!
        </Title>
        <Text>Você pode fechar essa página agora.</Text>
      </>
    )
  }
  console.log(data)
}
