import { join } from "path"

import { Contributors } from "@/components/Contributors"
import { MarkdownProvider } from "@/components/Markdown/Provider"
import TagLink from "@/components/TagLink"

import { fetchPapers, getPaper } from "@/lib/papers"
import { PATH_ASSETS } from "@/lib/constants"

export async function generateStaticParams() {
  const allPapers = fetchPapers()
  return allPapers.map(({ slug }) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params

  const { frontmatter, content } = getPaper(slug)
  const { title, authors, tags, datePublished, publicationVenue, image } =
    frontmatter

  return (
    <main className="row-start-2 mt-8 w-full max-w-7xl">
      <div className="mb-8 max-w-3xl space-y-3">
        <time
          dateTime={datePublished}
          className="text-secondary-foreground block font-sans text-sm font-semibold"
        >
          {new Date(datePublished).toLocaleDateString("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <h1 className="text-4xl font-bold tracking-[0.01em] md:text-5xl">
          {title}
        </h1>

        <Contributors names={authors} />

        <div className="mt-12 space-x-4">
          {tags.map((tag, i) => (
            <TagLink key={i} type="paper">
              {tag}
            </TagLink>
          ))}
        </div>
      </div>
      <hr className="my-12" />
      <div className="mt-12 max-w-3xl space-y-3">
        <img src={join(PATH_ASSETS, image)} alt="" />

        <div className="font-sans">{publicationVenue}</div>
      </div>

      <article className="max-w-3xl font-sans">
        <MarkdownProvider>{content}</MarkdownProvider>
      </article>
    </main>
  )
}
