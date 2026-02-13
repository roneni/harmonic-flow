import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Free forever. Save playlists and unlock all energy modes.
        </p>
      </div>

      <AuthForm mode="signup" />

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
