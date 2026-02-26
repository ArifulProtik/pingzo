import { IconMoodSmile, IconPaperclip, IconSend } from '@tabler/icons-react';
import { type KeyboardEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 0) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift sends the message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter inserts a line break (default behavior)
  };

  const canSend = message.trim().length > 0;

  return (
    <div className="border-t border-border p-4">
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Attach file"
        >
          <IconPaperclip />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Add emoji"
        >
          <IconMoodSmile />
        </Button>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 min-h-10 max-h-32"
        />

        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          aria-label="Send message"
        >
          <IconSend />
        </Button>
      </div>
    </div>
  );
}
