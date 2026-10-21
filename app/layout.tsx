import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Management System",
  description: "School records, learning, attendance, and family services.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkConfigured = Boolean(publishableKey && process.env.CLERK_SECRET_KEY);
  return (
    <html lang="en">
      <body>{clerkConfigured ? <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider> : children}</body>
    </html>
  );
}
