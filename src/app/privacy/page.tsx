import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "HarmonySet privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-text-secondary mb-10">
        Last updated: March 1, 2026
      </p>

      <div className="space-y-8 text-[15px] leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Your files stay on your device
          </h2>
          <p>
            HarmonySet processes playlist files entirely in your browser.
            Your files are never uploaded to any server. All parsing,
            analysis, and optimization happens client-side using JavaScript.
            We have no access to your playlist data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            What we collect when you sign up
          </h2>
          <p>
            If you create an account (via email or Google sign-in), we store
            your email address and display name in our database. That's it.
            Google OAuth is used for authentication only — we request your
            name and email, nothing else. We don't access your Google Drive,
            contacts, or any other Google data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            How we use your data
          </h2>
          <p>
            Your email and display name are used solely for account
            management — logging in, identifying your saved playlists, and
            sending you important account-related updates if needed. We
            don't send marketing emails unless you explicitly opt in.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            We don't sell or share your data
          </h2>
          <p>
            We do not sell, rent, or share your personal information with
            third parties. Your data is yours.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Cookies and analytics
          </h2>
          <p>
            We use essential cookies for authentication (keeping you logged
            in). We may use basic, privacy-respecting analytics to
            understand how the site is used. We don't use tracking pixels,
            retargeting, or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Contact
          </h2>
          <p>
            If you have any questions about this policy or your data, reach
            out at{" "}
            <a
              href="mailto:hello@harmonyset.com"
              className="text-primary hover:underline"
            >
              hello@harmonyset.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
