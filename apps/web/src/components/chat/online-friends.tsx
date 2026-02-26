import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types/chat';

interface OnlineFriendsProps {
  friends: User[];
}

export function OnlineFriends({ friends }: OnlineFriendsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-2">
      {friends.map((friend) => (
        <Link
          key={friend.id}
          to="/chat/$username"
          params={{ username: friend.username }}
          className="flex-shrink-0 relative focus:outline-none focus:ring-2 focus:ring-ring rounded-full"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={friend.avatar}
              alt={friend.name}
            />
            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-chart-1 border-2 border-background rounded-full" />
        </Link>
      ))}
    </div>
  );
}
