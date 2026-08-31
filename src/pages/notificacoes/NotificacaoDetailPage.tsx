import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNotificacaoDetail } from '@/api/endpoints/notificacoes/notificacoes'
import type { Notificacao } from '@/api/models'
import { PageLayout } from '@/components/layout'
import { useAlterarTitle } from '@/hooks/useAlterarTitle'
import CardNotificacao from './components/CardNotificacao'

interface NotificacaoDetailPageProps {
  id: Notificacao['id']
}

export default function NotificacaoDetailPage({
  id,
}: NotificacaoDetailPageProps) {
  const {
    data: notificacao,
    isLoading,
    isError,
    isSuccess,
  } = useNotificacaoDetail(id)
  const queryClient = useQueryClient()

  useAlterarTitle(notificacao?.titulo ?? 'Notificação')

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-pendentes'] })
    }
  }, [isSuccess, queryClient])

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Dashboard', href: '/app' },
        { label: 'Notificações', href: '/app/notificacoes' },
        { label: notificacao?.titulo || 'Notificação', isCurrentPage: true },
      ]}
      title="Notificações"
      description="Acompanhe e gerencie suas notificações"
    >
      <CardNotificacao
        notificacao={notificacao}
        isLoading={isLoading}
        isError={isError}
      />
    </PageLayout>
  )
}
