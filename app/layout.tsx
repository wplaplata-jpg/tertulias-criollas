import type { Metadata } from "next";
import { Cormorant_Garamond, Cormorant_Infant, Lora } from "next/font/google";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  style: ["normal", "italic"],
  weight: ["500", "600"]
});

const bodyFont = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"]
});

const heroFont = Cormorant_Infant({
  subsets: ["latin"],
  variable: "--font-hero",
  style: ["italic"],
  weight: ["500"]
});

export const metadata: Metadata = {
  title: "Tertulias Criollas",
  description: "An exclusive artistic experience"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${heroFont.variable} bg-background font-[var(--font-body)] text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
