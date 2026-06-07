import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-700 text-slate-300',
  success: 'bg-emerald-900/50 text-emerald-400 border border-emerald-700/50',
  warning: 'bg-amber-900/50 text-amber-400 border border-amber-700/50',
  danger: 'bg-rose-900/50 text-rose-400 border border-rose-700/50',
  info: 'bg-blue-900/50 text-blue-400 border border-blue-700/50',
  gold: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
