"use client";

import { useState, useEffect, useRef } from "react";

export function RekordboxImportHelp() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold text-text-secondary transition-colors hover:bg-text-secondary/10 hover:text-text-primary"
        aria-label="How to import into Rekordbox"
      >
        ?
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-lg border border-text-secondary/20 bg-surface p-4 shadow-lg">
          <p className="text-xs font-semibold text-text-primary">
            How to import into Rekordbox
          </p>

          <div className="mt-2.5 space-y-2 text-[11px] leading-relaxed text-text-secondary">
            <p>
              <span className="font-medium text-text-primary">Rekordbox 6+:</span>{" "}
              Preferences &rarr; Advanced &rarr; Database &rarr; rekordbox xml.
              Browse to this file &mdash; it will appear as a collection in the
              left sidebar.
            </p>
            <p>
              <span className="font-medium text-text-primary">Don&apos;t use File &rarr; Import.</span>{" "}
              That only accepts .m3u and .pls files, not XML.
            </p>
            <p className="italic text-text-secondary/70">
              Tip: Search YouTube for &quot;rekordbox import xml&quot; + your
              version for a visual walkthrough.
            </p>
          </div>

          {/* Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-text-secondary/20 bg-surface" />
        </div>
      )}
    </div>
  );
}
