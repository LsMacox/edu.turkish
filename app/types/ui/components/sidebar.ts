export interface TableOfContentsItem {
  id: string
  title: string
  order: string
}

export interface QuickFactItem {
  title: string
  value: string
  icon?: string
}

export interface ShareLink {
  label: string
  href: string
  icon: string
}

export interface SidebarTableOfContentsProps {
  title: string
  items: TableOfContentsItem[]
  activeId?: string | null
  containerClass?: string
}

export interface SidebarQuickFactsProps {
  title: string
  items: QuickFactItem[]
  containerClass?: string
}

export interface SidebarShareLinksProps {
  title: string
  description?: string
  links: ShareLink[]
  showCopyLink?: boolean
  copyLinkText?: string
  containerClass?: string
}

export interface SidebarTagsProps {
  title: string
  tags: string[]
  containerClass?: string
}
