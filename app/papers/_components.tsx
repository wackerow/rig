"use client"

import { useState } from "react"
import { join } from "path"
import { useSearchParams } from "next/navigation"

import { PaginationNav } from "@/components/PaginationNav"
import PaperPreviewRow from "@/components/PaperPreviewRow"

import type { PaperSummary } from "@/lib/types"

import { cn } from "@/lib/utils"

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

// Function to get initial filter values - used both for SSR and CSR
function getInitialFilters(searchParams: URLSearchParams) {
  return {
    year: searchParams.get("year") || "",
    author: searchParams.get("author") || "",
    tag: searchParams.get("tag") || ""
  }
}

export function PapersPage({ allPapers, options }: PapersPageProps) {
  const searchParams = useSearchParams()
  
  // Initialize filter values from URL at component initialization
  // This ensures first render matches the URL both server-side and client-side
  const initialFilters = getInitialFilters(searchParams as unknown as URLSearchParams)
  
  // Use URL values for initial state to avoid flash of unfiltered content
  const [yearFilter, setYearFilter] = useState(initialFilters.year)
  const [authorFilter, setAuthorFilter] = useState(initialFilters.author)
  const [tagFilter, setTagFilter] = useState(initialFilters.tag)
  const [currentPage, setCurrentPage] = useState(1)

  const { years, authors, tags } = options

  // Check if any filter is active
  const filtered = yearFilter !== "" || authorFilter !== "" || tagFilter !== ""

  // Update URL with current filter state
  const updateURL = (newYear: string, newAuthor: string, newTag: string) => {
    const params = new URLSearchParams()
    
    if (newYear) params.set("year", newYear)
    if (newAuthor) params.set("author", newAuthor)
    if (newTag) params.set("tag", newTag)
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.pushState({}, '', newUrl)
  }

  // Update filters and URL
  const updateFilters = (param: string, value: string) => {
    // Create new state values
    const newYearFilter = param === "year" ? value : yearFilter
    const newAuthorFilter = param === "author" ? value : authorFilter
    const newTagFilter = param === "tag" ? value : tagFilter
    
    // Update all state together
    setYearFilter(newYearFilter)
    setAuthorFilter(newAuthorFilter)
    setTagFilter(newTagFilter)
    setCurrentPage(1)
    
    // Update URL for bookmarking without page reload
    updateURL(newYearFilter, newAuthorFilter, newTagFilter)
  }

  // Handle reset filters
  const resetFilters = (e: React.MouseEvent) => {
    e.preventDefault()
    setYearFilter("")
    setAuthorFilter("")
    setTagFilter("")
    setCurrentPage(1)
    window.history.pushState({}, '', window.location.pathname)
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
      <div
        className={cn(
          "grid gap-4 p-4 font-sans text-sm lg:gap-x-10 lg:p-8",
          "grid-cols-3 lg:grid-cols-[auto_auto_1fr_1fr_auto]"
        )}
      >
        <span className="col-start-1 row-start-1 text-nowrap max-lg:col-span-2">
          Filter by:
        </span>
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

        <div className="col-start-3 row-start-1 max-lg:text-end lg:col-start-5">
          <button
            onClick={resetFilters}
            className={cn(
              "text-primary invisible hover:underline",
              filtered && "visible"
            )}
          >
            Reset
          </button>
        </div>
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
