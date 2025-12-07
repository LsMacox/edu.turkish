export type HeroContent = {
  title: string
  titleAccent: string
  description: string
  searchPlaceholder: string
  imageAlt: string
  highlight: { title: string; subtitle: string }
  stats: { icon: string; label: string }[]
}

export type SidebarPopularItem = {
  id: number | string
  slug: string | null
  title: string
  date: string
}

export type SidebarPopular = {
  title: string
  items: SidebarPopularItem[]
}

export type QuickLinksContent = {
  title: string
  items: { id: string; label: string }[]
}
