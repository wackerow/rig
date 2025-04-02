type BaseFrontMatter = {
  title: string
  authors: string[]
  tags: string[]
}

export type PostFrontMatter = BaseFrontMatter & {
  datePublished: string
}

export type PaperFrontMatter = PostFrontMatter & {
  publicationVenue: string
}

export type TalkFrontMatter = BaseFrontMatter & {
  location: string
  startDate: string
  endDate?: string
}
