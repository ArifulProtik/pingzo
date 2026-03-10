import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { wsClient } from '@/lib/ws/ws-client';
import { initWS } from '@/lib/ws/ws-init';

export const Route = createFileRoute('/_main')({
  component: RouteComponent,
});

function RouteComponent() {
  // Establish a global WebSocket connection for the main route and ensure it is
  // cleanly torn down. This effect is important because leaving websocket
  // connections open can lead to resource leaks, duplicate messages, or server
  // processes remaining active after the user navigates away or closes the tab.
  // We initialize the connection on mount, add a 'beforeunload' listener to
  // handle browser/tab close or refresh, and also close the client in the
  // React cleanup to cover component unmounts (e.g. route transitions).
  useEffect(() => {
    initWS();
    const handleUnload = () => {
      wsClient.close();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      wsClient.close();
    };
  }, []);
  return <Outlet />;
}
