import type { Metadata, Viewport } from "next";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";

export const metadata: Metadata = {
  metadataBase: new URL("https://open-brain-dashboard-eight.vercel.app"),
  title: "Open Brain | Don French",
  description: "Personal Life Operating System -- Command Center for Jumm Life & Performance Golf",
  icons: {
    icon: "/favicon.svg",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Open Brain",
  },
  openGraph: {
    title: "Open Brain | Don French",
    description: "Personal Life Operating System Dashboard",
    url: "https://open-brain-dashboard-eight.vercel.app",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Open Brain Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Brain | Don French",
    description: "Personal Life Operating System Dashboard",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#00ffc8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SidebarWrapper>
          {children}
        </SidebarWrapper>
      </body>
    </html>
  );
}
