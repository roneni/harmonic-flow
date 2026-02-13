"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { canAccessFeature, type FeatureName } from "@/lib/tiers/features";
import type { ReactNode } from "react";

interface ProGateProps {
  feature: FeatureName;
  children: ReactNode;
  /** What to show when the user doesn't have access */
  fallback?: "lock" | "signup-banner" | "hidden";
}

export function ProGate({
  feature,
  children,
  fallback = "lock",
}: ProGateProps) {
  const { tier, user } = useAuth();

  if (canAccessFeature(tier, feature)) {
    return <>{children}</>;
  }

  if (fallback === "hidden") {
    return null;
  }

  if (fallback === "signup-banner" && !user) {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center">
        <p className="text-sm text-text-secondary">
          <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
            Create a free account
          </Link>{" "}
          to unlock this feature.
        </p>
      </div>
    );
  }

  // Default: lock overlay
  return (
    <div className="relative">
      <div className="pointer-events-none opacity-30 blur-[2px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-lg bg-surface/90 px-4 py-2 text-center backdrop-blur-sm">
          <svg
            className="mx-auto h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <p className="mt-1 text-xs font-medium text-text-secondary">
            {user ? "Pro Feature" : "Free Account Required"}
          </p>
        </div>
      </div>
    </div>
  );
}
