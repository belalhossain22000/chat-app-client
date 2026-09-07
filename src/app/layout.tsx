import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ChatFlow — Real-time messaging for teams",
    template: "%s · ChatFlow",
  },
  description:
    "ChatFlow is a real-time chat app for one-to-one and group conversations — instant delivery, live updates, and a message experience built for focus.",
  applicationName: "ChatFlow",
  keywords: [
    "chat app",
    "real-time messaging",
    "group chat",
    "team communication",
    "instant messaging",
    "ChatFlow",
  ],
  authors: [{ name: "ChatFlow" }],
  creator: "ChatFlow",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ChatFlow",
    title: "ChatFlow — Real-time messaging for teams",
    description:
      "Real-time one-to-one and group chat with instant delivery and live updates.",
    images: [{ url: "/logo.png", alt: "ChatFlow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatFlow — Real-time messaging for teams",
    description:
      "Real-time one-to-one and group chat with instant delivery and live updates.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        {children}
      </body>
    </html>
  );
}
