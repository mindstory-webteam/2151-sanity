// layout.tsx  (Server Component — NO "use client" here)
// ─────────────────────────────────────────────────────────────────────────────
// Import the CLIENT WRAPPER, not StaggeredMenu directly.
// The wrapper owns the "use client" boundary + all event handlers.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
 // ← client wrapper


export const metadata: Metadata = {
  title:       "21FiftyOne",
  description: "AI Production House · Luxury & Editorial",
   verification: {
    google: "1-WhDAqdhHAFquzeH_Ng5GewcF94oqd_t6NwEblLpSk",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/*
          StaggeredMenuClient carries "use client" internally.
          No event-handler props are passed across the server/client boundary,
          so Next.js won't throw.
        */}

        
        {children}
      </body>
    </html>
  );
}