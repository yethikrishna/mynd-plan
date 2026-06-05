import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "mynd-plan — AI Product Navigator",
  description: "An original AI product navigator agent. Built by the Brief team.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
