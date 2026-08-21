import { Tooltip, ActionIcon, Group, Button, rem } from '@mantine/core'
import { IconDeviceFloppy, IconPencil, IconX } from '@tabler/icons-react'

interface BotoesEdicaoProps {
  isEditing: boolean
  onEditar: () => void
  onSalvar: () => void
  onCancelar: () => void
}

export function BotoesEdicao({
  isEditing,
  onEditar,
  onSalvar,
  onCancelar,
}: BotoesEdicaoProps) {
  if (!isEditing) {
    return (
      <Tooltip label="Editar informações">
        <ActionIcon
          variant="subtle"
          color="secondary"
          size="xl"
          onClick={onEditar}
          aria-label="Editar"
        >
          <IconPencil style={{ width: rem(16), height: rem(16) }} />
        </ActionIcon>
      </Tooltip>
    )
  }

  return (
    <Group gap="xs">
      <Button
        variant="filled"
        color="gray"
        size="xs"
        leftSection={<IconX size={14} />}
        onClick={onCancelar}
      >
        Cancelar
      </Button>
      <Button
        variant="filled"
        size="xs"
        leftSection={<IconDeviceFloppy size={14} />}
        onClick={onSalvar}
      >
        Salvar alterações
      </Button>
    </Group>
  )
}
