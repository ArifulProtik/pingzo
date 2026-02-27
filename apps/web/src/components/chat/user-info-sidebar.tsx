import { IconX } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/types/chat';

interface UserInfoSidebarProps {
  user: User;
  onClose: () => void;
}

export function UserInfoSidebar({ user, onClose }: UserInfoSidebarProps) {
  return (
    <div className="w-[320px] border-l border-border bg-card flex flex-col h-full">
      {/* User Profile */}
      <div className="flex flex-col items-center py-8 px-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
            />
            <AvatarFallback className="text-2xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {user.isOnline && (
            <div className="absolute bottom-2 right-2 h-5 w-5 bg-chart-1 border-4 border-background rounded-full" />
          )}
        </div>

        <h3 className="mt-4 text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">
          {user.isOnline ? 'Online' : 'Offline'}
        </p>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-2 px-6 py-4">
        <Button
          variant="outline"
          className="flex-1"
        >
          Call
        </Button>
        <Button
          variant="outline"
          className="flex-1"
        >
          Video
        </Button>
      </div>

      <Separator />

      {/* Shared Media Section */}
      <div className="px-6 py-4">
        <h3 className="text-sm font-medium mb-3">Shared Media</h3>
        <div className="grid grid-cols-3 gap-2">
          {/* Placeholder for shared media */}
          <div className="aspect-square bg-muted rounded-lg" />
          <div className="aspect-square bg-muted rounded-lg" />
          <div className="aspect-square bg-muted rounded-lg" />
        </div>
        <Button
          variant="ghost"
          className="w-full mt-2 text-sm"
        >
          View All
        </Button>
      </div>
    </div>
  );
}
