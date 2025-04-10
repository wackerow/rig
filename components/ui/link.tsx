import { AnchorHTMLAttributes, forwardRef } from "react"
import NextLink, { type LinkProps as NextLinkProps } from "next/link"

import { ExternalLink } from "lucide-react"

import * as url from "@/lib/url"
import { cn } from "@/lib/utils"

type BaseProps = {
  hideArrow?: boolean
}

export type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<NextLinkProps, "href">

/**
 * Link wrapper which handles:
 *
 * - Hashed links
 * e.g. <Link href="/page-2/#specific-section">
 *
 * - External links
 * e.g. <Link href="https://example.com/">
 */
export const BaseLink = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, className, hideArrow, ...props }: LinkProps,
  ref
) {
  if (!href) {
    console.warn("Link component is missing href prop")
    return <a {...props} />
  }

  const isExternal = url.isExternal(href)
  const isHash = url.isHash(href)

  const commonProps = { ref, ...props, className, href }

  if (isExternal) {
    return (
      <a target="_blank" rel="noopener" {...commonProps}>
        {children}
        <span className="sr-only">(opens in a new tab)</span>
        {!hideArrow && (
          <ExternalLink className="ms-1 mb-1 inline size-[1em] text-nowrap" />
        )}
      </a>
    )
  }

  if (isHash) return <a {...commonProps}>{children}</a>

  return <NextLink {...commonProps}>{children}</NextLink>
})
BaseLink.displayName = "BaseLink"

export const BracketLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, className, ...props }: LinkProps, ref) => (
    <BaseLink
      className={cn(
        "hover:text-primary text-foreground block w-fit font-sans tracking-[0.02em]",
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="text-primary font-medium select-none">&#91;&nbsp;</span>
      {children}
      <span className="text-primary font-medium select-none">&nbsp;&#93;</span>
    </BaseLink>
  )
)
BracketLink.displayName = "BracketLink"

const InlineLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }: LinkProps, ref) => {
    return (
      <BaseLink
        className={cn(
          "font-body text-primary visited:text-primary-visited hover:text-primary-light",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
InlineLink.displayName = "InlineLink"

export default InlineLink
