---
name: hand-rolled-shadcn
description: When the shadcn CLI is unusable (no TTY, blocked shells, or auto-mode safety), hand-roll shadcn-style components matching the official API: Radix UI primitives + class-variance-authority + tailwind-merge + Tailwind CSS variables.
source: auto-skill
extracted_at: '2026-07-06T05:03:43.913Z'
---

# Hand-rolling shadcn/ui components

The official `pnpm dlx shadcn@latest add <name>` requires an interactive TTY. In environments where that's blocked (auto-mode classifiers, sandboxed shells, CI without TTY), the output is still achievable by hand. The components are functionally identical to CLI output and live in the same path.

## The five pieces every shadcn component needs

1. **Radix UI primitive** — `@radix-ui/react-{dialog|dropdown-menu|tabs|...}`
2. **class-variance-authority (cva)** — for variant-based class sets (e.g. `variant: 'default' | 'destructive'`)
3. **clsx + tailwind-merge** — combined in a `cn()` helper at `src/lib/utils.ts`
4. **Tailwind CSS variables** — for colors (`bg-background`, `text-foreground`, `border-border`, `bg-primary`)
5. **`forwardRef`** so the component can receive a `ref` from `react-hook-form` or Radix

## Minimum dependency set

```bash
pnpm add @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-label @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-tabs @radix-ui/react-avatar @radix-ui/react-tooltip \
  @radix-ui/react-progress @radix-ui/react-checkbox @radix-ui/react-switch \
  @radix-ui/react-popover @radix-ui/react-scroll-area
pnpm add clsx tailwind-merge class-variance-authority
```

## Required CSS variables (in `src/index.css`)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    /* chart colors, sidebar, success/warning/info — see shadcn themes */
  }
  .dark { /* same set with dark values */ }
}
```

The Tailwind config then maps these into utility classes:

```js
// tailwind.config.js
colors: {
  border: 'hsl(var(--border))',
  background: 'hsl(var(--background))',
  primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
  // ...etc
}
```

## Standard component template (Button)

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

## Standard patterns to know

- **`asChild` + Slot** — lets Button be used as `<Button asChild><Link to="/x">...</Link></Button>` without breaking styles
- **Compound components** — `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer` use `React.createContext` to share classes
- **Dialog/Modal** — Radix's `Portal` + `Overlay` + `Content`. The Radix `data-[state=open]` attribute is what makes the Tailwind `animate-in` classes work
- **forwardRef with `displayName`** — required so React DevTools shows the component name
- **cn() helper** — always `twMerge(clsx(...))` to let user classes override defaults without conflict

## When to use this

✅ Auto-mode / sandboxed shells where `pnpm dlx` is blocked
✅ CI/CD environments that forbid network at runtime
✅ Quick prototypes where you want full shadcn parity but don't want to install the CLI
✅ Offline development

❌ Don't use this if the CLI works — `pnpm dlx shadcn@latest add` is the official path and auto-generates the latest variants
