import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactElement, cloneElement } from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex min-w-0 items-center justify-center gap-2 rounded-full border border-transparent bg-clip-padding text-[18px] font-heading font-semibold tracking-[0.01em] transition duration-300 ease-in-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-[0_20px_50px_-20px_rgba(45,27,78,0.25)] hover:-translate-y-1 hover:bg-primary/90',
        outline:
          'border-secondary bg-white text-secondary hover:bg-secondary/10 hover:text-secondary hover:border-secondary shadow-sm shadow-secondary/10',
        secondary:
          'bg-secondary text-white border border-secondary shadow-sm shadow-secondary/20 hover:bg-secondary/90',
        ghost:
          'bg-transparent text-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'bg-transparent px-0 text-primary underline-offset-4 hover:underline hover:bg-transparent',
      },
      size: {
        default:
          'h-12 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        xs: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 rounded-[min(var(--radius-md),12px)] px-4 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-10 rounded-full',
        'icon-xs':
          "size-8 rounded-full [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          "size-9 rounded-full [&_svg:not([class*='size-'])]:size-4",
        'icon-lg': "size-11 rounded-full [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & {
  asChild?: boolean
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const classNameValue = cn(buttonVariants({ variant, size, className }))

  if ('asChild' in props && props.asChild && children) {
    const child = children as ReactElement<{ className?: string }>
    const { asChild, ...buttonProps } = props

    return cloneElement(child, {
      className: cn(classNameValue, child.props.className),
      'data-slot': 'button',
      ...buttonProps,
    } as any)
  }

  return (
    <ButtonPrimitive
      type={type}
      data-slot="button"
      className={classNameValue}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
