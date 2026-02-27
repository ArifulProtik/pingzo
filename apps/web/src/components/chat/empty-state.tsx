import { IconMessage } from '@tabler/icons-react';

export function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <IconMessage
          size={48}
          className="text-muted-foreground"
          strokeWidth={1.5}
        />
        <p className="text-muted-foreground">
          Select a conversation to start messaging
        </p>
      </div>
    </div>
  );
}
