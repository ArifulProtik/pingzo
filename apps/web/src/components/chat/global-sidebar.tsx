import {
  IconHome,
  IconMessage,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useMatchRoute } from '@tanstack/react-router';

export function GlobalSidebar() {
  const matchRoute = useMatchRoute();

  // Check if current route matches /chat or /chat/:username
  const isChatActive =
    matchRoute({ to: '/chat' }) || matchRoute({ to: '/chat/$username' });

  return (
    <nav
      className="flex flex-col items-center py-4 gap-4 h-full"
      aria-label="Global navigation"
    >
      {/* Top navigation icons */}
      <div className="flex flex-col items-center gap-4">
        <Link
          to="/"
          className="p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          aria-label="Home"
        >
          <IconHome
            size={24}
            stroke={1.5}
          />
        </Link>

        <button
          type="button"
          className="p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          aria-label="Friends"
        >
          <IconUsers
            size={24}
            stroke={1.5}
          />
        </button>

        <Link
          to="/chat"
          className={`p-3 rounded-lg transition-colors ${
            isChatActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
          aria-label="Messages"
          aria-current={isChatActive ? 'page' : undefined}
        >
          <IconMessage
            size={24}
            stroke={1.5}
          />
        </Link>
      </div>

      {/* Settings icon aligned to bottom */}
      <div className="mt-auto">
        <button
          type="button"
          className="p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          aria-label="Settings"
        >
          <IconSettings
            size={24}
            stroke={1.5}
          />
        </button>
      </div>
    </nav>
  );
}
