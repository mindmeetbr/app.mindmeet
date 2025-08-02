import { Container, Stack } from '@mantine/core'
import { PageBreadcrumbs, type BreadcrumbItem } from './PageBreadcrumbs'
import { PageHeader } from './PageHeader'
import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  description?: string
  primaryAction?: {
    label: string
    icon?: ReactNode
    onClick?: () => void
    loading?: boolean
    variant?: 'filled' | 'light' | 'outline' | 'subtle'
  }
  secondaryAction?: {
    label: string
    icon?: ReactNode
    onClick?: () => void
    variant?: 'filled' | 'light' | 'outline' | 'subtle'
  }
  headerChildren?: ReactNode
  containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function PageLayout({
  children,
  breadcrumbs,
  title,
  description,
  primaryAction,
  secondaryAction,
  headerChildren,
  containerSize = 'xl'
}: PageLayoutProps) {
  return (
    <Container size={containerSize}>
      <Stack gap="lg">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <PageBreadcrumbs items={breadcrumbs} />
        )}
        
        {title && (
          <PageHeader
            title={title}
            description={description}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
          >
            {headerChildren}
          </PageHeader>
        )}
        
        {children}
      </Stack>
    </Container>
  )
}