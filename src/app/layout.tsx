import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const description =
  "Quickly calculate your business's Adjusted EBITDA and Adjusted EBITDA margin. Start from net income, add back interest, taxes, depreciation and amortization, then normalize for one-time and owner-specific items.";

export const metadata: Metadata = {
  metadataBase: new URL("https://adjusted-ebitda-calculator.vercel.app"),
  title: {
    default: "Adjusted EBITDA Calculator | Aspen Valuations",
    template: "%s | Aspen Valuations",
  },
  description,
  keywords: [
    "adjusted EBITDA calculator",
    "EBITDA calculator",
    "EBITDA margin",
    "normalized EBITDA",
    "add-backs",
    "Aspen Valuations",
  ],
  openGraph: {
    title: "Adjusted EBITDA Calculator | Aspen Valuations",
    description,
    type: "website",
    siteName: "Aspen Valuations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adjusted EBITDA Calculator | Aspen Valuations",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
