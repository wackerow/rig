"use client"

import { useState } from "react"
import { join } from "path"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { PaginationNav } from "@/components/PaginationNav"
import PaperPreviewRow from "@/components/PaperPreviewRow"

import type { PaperSummary } from "@/lib/types"
import { MAX_PER_PAGE, PATH_PAPERS, TAGS } from "@/lib/constants"

type FilterOptions = {
  years: number[]
  authors: string[]
  tags: string[]
}

type PapersPageProps = {
  allPapers: PaperSummary[]
  options: FilterOptions
}

export function PapersPage({ allPapers, options }: PapersPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get filter values from URL query parameters
  const yearFilter = searchParams.get("year") || ""
  const authorFilter = searchParams.get("author") || ""
  const tagFilter = searchParams.get("tag") || ""

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1)

  const { years, authors, tags } = options

  // Check if any filter is active
  const filtered = yearFilter !== "" || authorFilter !== "" || tagFilter !== ""

  // Update URL with filters
  const updateFilters = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "") {
      params.delete(param)
    } else {
      params.set(param, value)
    }

    router.push(`?${params.toString()}`)

    // Reset to page 1 when filters change
    setCurrentPage(1)
  }

  // Filter papers based on selected filters
  const filteredPapers = allPapers.filter(({ frontmatter }) => {
    const matchesYear =
      yearFilter === "" ||
      new Date(frontmatter.datePublished).getFullYear().toString() ===
        yearFilter
    const matchesAuthor =
      authorFilter === "" || frontmatter.authors.includes(authorFilter)

    const matchesTag =
      tagFilter === "" ||
      frontmatter.tags.some((tag) => {
        // Find the key in TAGS object that corresponds to this tag
        const tagKey = Object.entries(TAGS).find(
          ([, value]) => value === tag
        )?.[0]
        return tagKey === tagFilter
      })

    return matchesYear && matchesAuthor && matchesTag
  })

  // Calculate pagination values
  const totalPapers = filteredPapers.length
  const totalPages = Math.max(1, Math.ceil(totalPapers / MAX_PER_PAGE))

  // Ensure current page is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  // Get the papers for the current page
  const startIndex = (validCurrentPage - 1) * MAX_PER_PAGE
  const endIndex = startIndex + MAX_PER_PAGE
  const paginatedPapers = filteredPapers.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-10 gap-y-4 p-4 font-sans text-sm max-md:flex-col md:items-center md:p-8 [&>select]:w-full [&>select]:max-w-xs">
        <span className="text-nowrap">Filter by:</span>
        <select
          id="filter-date"
          className="border-b px-2 py-1"
          value={yearFilter}
          onChange={(e) => updateFilters("year", e.target.value)}
        >
          <option value="">Year</option>
          {years
            .sort((a, b) => b - a)
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
        <select
          id="filter-author"
          className="border-b px-2 py-1"
          value={authorFilter}
          onChange={(e) => updateFilters("author", e.target.value)}
        >
          <option value="">Author</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
        <select
          id="filter-tag"
          className="border-b px-2 py-1"
          value={tagFilter}
          onChange={(e) => updateFilters("tag", e.target.value)}
        >
          <option value="">Field</option>
          {tags.map((tag) => {
            // Find the key in TAGS object that corresponds to this tag
            const tagKey =
              Object.entries(TAGS).find(([, value]) => value === tag)?.[0] || ""
            return (
              <option key={tagKey} value={tagKey}>
                {tag}
              </option>
            )
          })}
        </select>
        {filtered && (
          <Link href="?" className="text-primary hover:underline">
            Reset
          </Link>
        )}
      </div>
      <div>
        {filteredPapers.length > 0 ? (
          <>
            {paginatedPapers.map(({ frontmatter, slug }) => (
              <PaperPreviewRow
                key={slug}
                frontmatter={frontmatter}
                href={join(PATH_PAPERS, slug)}
                className="border-b px-5"
              />
            ))}

            {totalPages > 1 && (
              <PaginationNav
                currentPage={validCurrentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-secondary-foreground mt-4 text-center">
            No papers found for the selected filters.
          </div>
        )}
      </div>
    </>
  )
}
