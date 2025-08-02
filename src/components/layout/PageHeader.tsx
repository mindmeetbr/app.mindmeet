import { 
  Card, 
  Group, 
  Title, 
  Text, 
  Button 
} from '@mantine/core'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
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
  children?: ReactNode
}

export function PageHeader({ 
  title, 
  description, 
  primaryAction, 
  secondaryAction,
  children 
}: PageHeaderProps) {
  return (
    <Card withBorder radius="md" p="lg">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} mb={description ? "xs" : undefined}>
            {title}
          </Title>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
          {children}
        </div>
        
        {(primaryAction || secondaryAction) && (
          <Group>
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                leftSection={secondaryAction.icon}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'filled'}
                leftSection={primaryAction.icon}
                onClick={primaryAction.onClick}
                loading={primaryAction.loading}
              >
                {primaryAction.label}
              </Button>
            )}
          </Group>
        )}
      </Group>
    </Card>
  )
}