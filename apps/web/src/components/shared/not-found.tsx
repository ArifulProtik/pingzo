import { Link } from '@tanstack/react-router';

export default function NotFound() {
  return (
    <main className="bg-background flex h-screen w-screen items-center justify-center flex-col">
      <div className="flex flex-1">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-lg">Page not found</p>
          <Link
            to="/"
            replace
            type="button"
            className="border-primary rounded-lg border px-4 py-1 text-primary"
          >
            Home
          </Link>
        </div>
      </div>
      <div className="bg-accent text-muted-foreground mx-auto text-sm w-full py-4 text-center">
        <p>PingZo &middot; {new Date().getFullYear()}</p>
      </div>
    </main>
  );
}
