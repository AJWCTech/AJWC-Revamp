"use client";

import { useSyncExternalStore } from "react";
import { getResolvedTheme, setTheme, subscribeTheme } from "@/lib/theme";

export function ThemeToggle() {
  const resolved = useSyncExternalStore(
    subscribeTheme,
    getResolvedTheme,
    () => "dark" as const,
  );

  const next = resolved === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="link-sweep flex items-center gap-2 text-left text-sm text-muted"
      aria-label={`Switch to ${next} theme`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        {resolved === "dark" ? (
          /* Moon — currently dark, so this shows the state you are in. */
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
          </>
        )}
      </svg>
      {resolved === "dark" ? "Dark" : "Light"}
    </button>
  );
}
