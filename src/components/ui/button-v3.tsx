/*
 * Button for /site-3, /site-4 and /new-construction — the versions built locally.
 * Same styling as the shared `button.tsx`, with one difference: no fixed width.
 * The shared button pins every text CTA to a 176px box, and the longer labels on
 * these pages overflow it. Here the width comes from the label plus 32px of
 * inline padding either side, so every button fits whatever it says.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Press feedback is a small scale, not a 1px sink: 1px on a 48px box is below
// perception. It fires after the pointer has landed, so it is not the
// "moves while you aim" drift the client banned (2026-09-01) — that is Magnetic.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-base font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // `text-brand-black`, not `text-primary-foreground`: the token is white,
        // and white on #EC663D measures 3.21:1 — large-text AA only, and a
        // button label is not large text. #090A0F on the same orange is 6.15:1
        // and is the documented brand pairing. Pinned rather than tokenised
        // because the fill is pinned: `bg-primary` is the same orange in both
        // themes, so its label cannot be theme-reactive.
        // A call site that overrides the fill (Approach's navy button) has to
        // override the label too.
        // `font-semibold` (600), one step above the `font-medium` (500) the
        // base sets and every other variant keeps. The primary is the one
        // button on a screen that should be read first, and at 14px on orange
        // the weight is what says so; twMerge resolves it against the base for
        // us, so the override lives here rather than at four call sites.
        // 600 is the mandated figure — +100 over the base 500. It shipped as
        // `font-bold` (700) by mistake, which is two steps, and at 14px on the
        // orange fill the extra step closed the counters up.
        default: "bg-primary text-brand-black font-semibold hover:bg-primary/80",
        // Outline means outline: a border and nothing behind it. Two changes
        // from the shadcn default, both from the 2026-09-01 client pass.
        //
        // Fill → transparent. It used to paint `bg-background` in light and
        // `dark:bg-input/30` in dark, and on the #090A0F page that 4% white
        // composited to rgb(20,21,25) — a near-black rectangle on a near-black
        // backdrop, which is what made the hero's secondary CTA disappear.
        // Transparent lets the page through, which is the point of the variant.
        //
        // Border → grey-600 in dark. `--input` is white at 14%, which comes out
        // rgb(44,45,49) on the page and measures 1.44:1 against it, under half
        // the 3:1 WCAG asks of a component boundary. grey-600 (#727984)
        // measures 4.51:1: unmistakably a button, and still under the orange
        // primary's 6.15:1, so the pair keeps its order.
        //
        // Hover is `--muted` in both themes — an existing token, a fill change
        // only, nothing that moves the button.
        outline:
          "border-border bg-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-grey-600 dark:bg-transparent dark:hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // The CTA box: 48px tall, 176px wide, content centred. `default` and
        // `lg` resolve to the same box on purpose — every text CTA on the site
        // is the same rectangle. The inline padding only matters when a call
        // site overrides the width (`w-auto`); the width governs otherwise, so
        // the icon-side padding hints are gone.
        // 48, not 44 (client mandate 2026-09-01): 44 is the accessibility
        // floor, 48 is on the 8-grid and still clears the header's h-20 row
        // with 16px either side.
        // gap-2, not gap-1.5: 6px was the one off-grid magnitude left in the
        // component layer under the 4px grid mandate.
        default: "h-12 gap-2 px-8",
        xs: "h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-8",
        // Standalone tap targets, so they hold the same 48px box as the text
        // CTAs. The small variants are for inline/grouped use, where 48px
        // would break the line they sit in.
        icon: "size-12",
        "icon-xs":
          "size-6 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-md in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
