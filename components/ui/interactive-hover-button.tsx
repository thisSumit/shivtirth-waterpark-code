import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

type InteractiveHoverButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
}

export function InteractiveHoverButton({
  children,
  className,
  href,
  ...props
}: InteractiveHoverButtonProps) {

  const content = (
    <>
      {/* Default State */}
      <div className="flex w-full items-center justify-center gap-2">
        <div className="bg-slate-900 h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[150]" />
        
        <span className="inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-0 group-hover:text-white">
          {children}
        </span>
      </div>

      {/* Hover State */}
      <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-white">
        <span>{children}</span>
        <ArrowRight className="h-4 w-4 text-white" />
      </div>
    </>
  )

  const sharedClassName = cn(
    "group relative inline-flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-accent px-8 py-3 text-center font-semibold whitespace-nowrap transition-colors duration-300",
    className
  )

  if (href) {
    const linkProps = props as Omit<React.ComponentProps<typeof Link>, "href" | "className">

    return (
      <Link href={href} className={sharedClassName} {...linkProps}>
        {content}
      </Link>
    )
  }

  return (
    <button className={sharedClassName} {...props}>
      {content}
    </button>
  )
}