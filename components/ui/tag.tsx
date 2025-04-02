import * as React from "react"

import { cn } from "@/lib/utils"

const Tag = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("block font-sans text-xs font-medium", className)}
    {...props}
  >
    <span className="text-accent-foreground">&#65378; </span>
    <span className="text-primary uppercase">{children}</span>
    <span className="text-accent-foreground"> &#65379;</span>
  </span>
))
Tag.displayName = "Tag"

export { Tag }
