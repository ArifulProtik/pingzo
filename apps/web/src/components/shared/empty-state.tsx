import type { Icon } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: Icon;
  title: string;
  SubText?: string;
  className?: string;
  size?: string;
}

const EmptyState = ({
  icon: Icon,
  title,
  SubText,
  size,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Icon size={size} />
      <h2 className="text-lg font-semibold">{title}</h2>
      {SubText && <p className="text-sm text-muted-foreground">{SubText}</p>}
    </div>
  );
};

export default EmptyState;
