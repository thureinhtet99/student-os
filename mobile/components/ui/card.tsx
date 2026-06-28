import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';

const cardVariants = cva(
  'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardProps extends React.ComponentPropsWithoutRef<typeof View>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return <View className={cn(cardVariants({ variant }), className)} {...props} />;
}

export { Card, cardVariants };
export type { CardProps };
