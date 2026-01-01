import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-ak-primary text-white shadow hover:bg-ak-primary/90 focus-visible:ring-ak-primary",
        destructive:
          "bg-ak-error text-white shadow-sm hover:bg-ak-error/90 focus-visible:ring-ak-error",
        outline:
          "border border-border-default bg-transparent shadow-sm hover:bg-ak-snow hover:text-text-primary",
        secondary:
          "bg-ak-snow text-text-primary shadow-sm hover:bg-ak-mist",
        ghost:
          "hover:bg-ak-snow hover:text-text-primary",
        link:
          "text-ak-primary underline-offset-4 hover:underline",
        success:
          "bg-ak-success text-white shadow-sm hover:bg-ak-success/90",
        warning:
          "bg-ak-warning text-white shadow-sm hover:bg-ak-warning/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
