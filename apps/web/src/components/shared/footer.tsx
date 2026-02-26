export default function Footer() {
  return (
    <div className="bg-accent text-muted-foreground mx-auto text-sm w-full py-4 text-center">
      <p suppressHydrationWarning>PingZo &middot; {new Date().getFullYear()}</p>
    </div>
  );
}
