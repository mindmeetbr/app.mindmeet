import { Card, Flex, Grid, Group, Skeleton, Stack } from '@mantine/core'

function SkeletonCardEstatistica() {
  return (
    <Card withBorder radius="md" p="xl">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={6} style={{ flex: '1', minWidth: 120 }}>
          <Skeleton height={10} width="60%" />
          <Skeleton height={24} width="40%" />
          <Skeleton height={10} width="80%" />
        </Stack>
        <Skeleton height={38} width={38} radius="md" />
      </Group>
    </Card>
  )
}

function SkeletonGrafico() {
  return (
    <Card
      withBorder
      radius="md"
      p="xl"
      h={{ base: '15rem', sm: '17.5rem', md: '20rem' }}
    >
      <Skeleton height={16} width="40%" mb="md" />
      <Skeleton height="60%" radius="2rem" mx="auto" />
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <Grid align="stretch">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <SkeletonGrafico />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Stack gap="md" h="100%" w="100%">
          <Flex
            gap="md"
            align="stretch"
            direction={{ base: 'column', sm: 'row' }}
            wrap={{ base: 'wrap', sm: 'nowrap' }}
          >
            <SkeletonCardEstatistica />
            <SkeletonCardEstatistica />
          </Flex>
          <Flex
            gap="md"
            align="stretch"
            direction={{ base: 'column', sm: 'row' }}
            wrap={{ base: 'wrap', sm: 'nowrap' }}
          >
            <SkeletonCardEstatistica />
            <SkeletonCardEstatistica />
          </Flex>
        </Stack>
      </Grid.Col>
    </Grid>
  )
}
