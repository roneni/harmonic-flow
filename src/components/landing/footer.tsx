import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-text-secondary/10 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-sm text-text-secondary">
          &copy; {year} HarmonicFlow. Built with care for the DJ community.
        </div>
        <div className="flex items-center gap-6 text-sm text-text-secondary">
          <Link
            href="/optimize"
            className="transition-colors hover:text-text-primary"
          >
            Optimize
          </Link>
          <Link
            href="/login"
            className="transition-colors hover:text-text-primary"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="transition-colors hover:text-text-primary"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
}
