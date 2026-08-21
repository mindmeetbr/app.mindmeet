import { SegmentedControl, Select } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

interface FiltroOpcao {
  label: string
  value: string
}

interface FiltroResponsivoProps {
  data: FiltroOpcao[]
  value: string
  onChange: (value: string) => void
  label?: string
}

export function FiltroResponsivo({
  data,
  value,
  onChange,
  label,
}: FiltroResponsivoProps) {
  const isMobile = useMediaQuery('(max-width: 48rem)')

  if (isMobile) {
    return (
      <Select
        label={label}
        data={data}
        value={value}
        onChange={v => onChange(v ?? '')}
        allowDeselect={false}
        w="100%"
      />
    )
  }

  return <SegmentedControl data={data} value={value} onChange={onChange} />
}
