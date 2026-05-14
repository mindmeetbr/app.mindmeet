import { Button, Flex, Loader, Table, Text } from '@mantine/core'

interface TableEmptyStateProps {
  isError?: boolean
  isLoading?: boolean
  isEmpty?: boolean
  colSpan: number
  onRetry?: () => void
  errorMessage?: string
  emptyMessage?: string
}

export function TableEmptyState({
  isError,
  isLoading,
  isEmpty,
  colSpan,
  onRetry,
  errorMessage,
  emptyMessage,
}: TableEmptyStateProps) {
  if (!isLoading && !isError && !isEmpty) return null

  return (
    <Table.Tr>
      <Table.Td colSpan={colSpan}>
        <Flex direction="column" align="center" gap="xs" py="lg">
          {isLoading && <Loader color="indigo" size="sm" type="dots" />}

          {isError && (
            <>
              <Text size="lg">{errorMessage}</Text>
              {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
            </>
          )}

          {isEmpty && !isError && <Text c="dimmed">{emptyMessage}</Text>}
        </Flex>
      </Table.Td>
    </Table.Tr>
  )
}
