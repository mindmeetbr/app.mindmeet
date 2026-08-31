import { useNotificacaoList } from '@/api/endpoints/notificacoes/notificacoes'
import { PageLayout } from '@/components/layout'
import { useAlterarTitle } from '@/hooks/useAlterarTitle'
import { usePaginacao } from '@/hooks/usePaginacao'
import TabelaNotificacoes from './components/TabelaNotificacoes'

export default function NotificacaoListPage() {
  useAlterarTitle('Notificações')

  const { pagina, tamanho, setPagina, setTamanho } = usePaginacao()
  const {
    data: dados,
    isLoading,
    isError,
    refetch,
  } = useNotificacaoList(
    { pagina, tamanho },
    { query: { queryKey: ['notificacoes', pagina, tamanho] } }
  )

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Notificações', isCurrentPage: true },
      ]}
      title="Notificações"
      description="Acompanhe e gerencie suas notificações"
    >
      <TabelaNotificacoes
        dados={dados}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        pagina={pagina}
        tamanho={tamanho}
        setPagina={setPagina}
        setTamanho={setTamanho}
      />
    </PageLayout>
  )
}
