import { createFileRoute } from '@tanstack/react-router'
import { Button, Container, Flex, Group, Stack, Text } from '@mantine/core'

import classes from './index.module.css'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {

  return (
    <div className={classes.test}>
      <Container size={900}>
        <Flex direction="row" gap="md" justify="space-between">
          <Stack gap="sm">
            <h1>
              A{' '}
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                inherit
              >
                fully featured
              </Text>{' '}
              React components and hooks library
            </h1>

            <Text>
              Build fully functional accessible web applications with ease –
              Mantine includes more than 100 customizable components and hooks
              to cover you in any situation
            </Text>

            <Group>
              <Button
                size="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
              >
                Get started
              </Button>

              <Button
                component="a"
                href="https://github.com/mantinedev/mantine"
                size="xl"
                variant="default"
              >
                GitHub
              </Button>
            </Group>
          </Stack>
          <img src="https://mantine.dev/static/logo.svg" alt="Mantine logo" />
        </Flex>
      </Container>
    </div>
  )
}
