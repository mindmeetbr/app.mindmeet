import { Text, Button, Group, rem } from '@mantine/core'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { ReactNode } from 'react'
import usePreferencesStore from '../../stores/preferences-store'

interface FinancialValueProps {
  value: string | number
  prefix?: string
  suffix?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight?: number
  color?: string
  showToggleButton?: boolean
  children?: ReactNode
}

export function FinancialValue({ 
  value, 
  prefix = '', 
  suffix = '',
  size = 'xl',
  weight = 700,
  color,
  showToggleButton = false,
  children
}: FinancialValueProps) {
  const { hideFinancialDetails, toggleFinancialDetails } = usePreferencesStore()

  const formatValue = () => {
    if (hideFinancialDetails) {
      return '••••••'
    }
    return `${prefix}${value}${suffix}`
  }

  if (showToggleButton) {
    return (
      <Group gap="xs" align="center">
        <Text fw={weight} fz={size} c={color}>
          {formatValue()}
        </Text>
        <Button
          variant="subtle"
          size="xs"
          p={4}
          onClick={toggleFinancialDetails}
          color="gray"
        >
          {hideFinancialDetails ? (
            <IconEye style={{ width: rem(14), height: rem(14) }} />
          ) : (
            <IconEyeOff style={{ width: rem(14), height: rem(14) }} />
          )}
        </Button>
        {children}
      </Group>
    )
  }

  return (
    <>
      <Text fw={weight} fz={size} c={color}>
        {formatValue()}
      </Text>
      {children}
    </>
  )
}