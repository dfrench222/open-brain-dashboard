import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://open-brain-dashboard.vercel.app"),
  title: "Open Brain | Don French",
  description: "Personal Life Operating System — Command Center for Jumm Life & Performance Golf",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Open Brain | Don French",
    description: "Personal Life Operating System Dashboard",
    url: "https://open-brain-dashboard.vercel.app",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
