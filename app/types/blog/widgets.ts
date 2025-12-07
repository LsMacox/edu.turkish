export interface ProsConsItem {
  title: string
  description?: string
}

export interface ProsConsData {
  title?: string
  pros: ProsConsItem[]
  cons: ProsConsItem[]
}

export interface GalleryImage {
  url: string
  alt?: string
}

export interface ImageGalleryData {
  title?: string
  images: GalleryImage[]
}
