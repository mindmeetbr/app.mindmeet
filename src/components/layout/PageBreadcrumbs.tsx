import { 
  Breadcrumbs, 
  Anchor, 
  Text, 
  rem 
} from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  isCurrentPage?: boolean
}

interface PageBreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function PageBreadcrumbs({ items }: PageBreadcrumbsProps) {
  const router = useRouter()

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.href) {
      router.navigate({ to: item.href as any })
    }
  }

  return (
    <Breadcrumbs separator={<IconChevronRight style={{ width: rem(12), height: rem(12) }} />}>
      {items.map((item, index) => (
        item.isCurrentPage ? (
          <Text key={index}>{item.label}</Text>
        ) : (
          <Anchor
            key={index}
            onClick={() => handleItemClick(item)}
            style={{ cursor: 'pointer' }}
          >
            {item.label}
          </Anchor>
        )
      ))}
    </Breadcrumbs>
  )
}