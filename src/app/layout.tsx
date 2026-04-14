import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/layout/Providers";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "WatchTracker — Movie & TV Show Watchlist",
  description:
    "Track movies and TV shows you want to watch, are watching, or have completed. Rate, review, and get recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#dc2626",
          colorBackground: "#1a1a1a",
          colorText: "#ffffff",
          colorTextSecondary: "#a3a3a3",
          colorInputBackground: "#262626",
          colorInputText: "#ffffff",
          colorNeutral: "#ffffff",
        },
      }}
    >
      <html
        lang="en"
        className={`${inter.variable} ${bebas.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <Providers>
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
