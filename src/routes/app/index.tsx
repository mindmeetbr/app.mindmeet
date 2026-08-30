import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { PageLayout } from '../../components/layout'
import 'dayjs/locale/pt-br'
import type React from 'react'
import { useDashboardDetail } from '../../api/endpoints/dashboard/dashboard'

import { useAlterarTitle } from '../../hooks/useAlterarTitle'
import { DashboardErro } from './-components/DashboardErro'
import { DashboardGestor } from './-components/DashboardGestor'
import { DashboardPsicologo } from './-components/DashboardPsicologo'
import { DashboardSkeleton } from './-components/DashboardSkeleton'

dayjs.locale('pt-br')

export const Route = createFileRoute('/app/')({
  component: Dashboard,
})

interface LayoutWrapperProps {
  children: React.ReactNode
}

function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <PageLayout
      title="Dashboard"
      description="Visão geral das suas atividades e métricas"
    >
      {children}
    </PageLayout>
  )
}

function Dashboard() {
  useAlterarTitle('Dashboard')
  const { data: dados, isLoading, isError, refetch } = useDashboardDetail()

  if (isLoading) {
    return (
      <LayoutWrapper>
        <DashboardSkeleton />
      </LayoutWrapper>
    )
  }

  if (isError || !dados) {
    return (
      <LayoutWrapper>
        <DashboardErro onTentarNovamente={() => refetch()} />
      </LayoutWrapper>
    )
  }

  const isPsicologo = dados.tipo_dashboard === 'psicologo'

  return (
    <LayoutWrapper>
      {isPsicologo ? (
        // @ts-expect-error: orval não sabe lidar com os tipos de dashboard
        <DashboardPsicologo dados={dados} />
      ) : (
        // @ts-expect-error: mesmo motivo de acima
        <DashboardGestor dados={dados} />
      )}
    </LayoutWrapper>
  )
}
