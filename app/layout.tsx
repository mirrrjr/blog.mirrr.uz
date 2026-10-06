import React from "react";
import type { Metadata, Viewport } from "next";

import "../styles/globals.css";

export const metadata: Metadata = {
    // title: "MIRRR | Developer Blog",
    // description:
    //     "A minimal developer blog with a terminal-inspired aesthetic. Thoughts on code, math, and technology.",
    generator: "Next.js",
    metadataBase: new URL("https://blog.mirrr.uz"),
    title: "MIRRR's blog",
    description: "MIRRR's blog website",
    alternates: {
        canonical: "https://blog.mirrr.uz",
        languages: {
            "en-US": "https://blog.mirrr.uz/en/en-US",
            "uz-UZ": "https://blog.mirrr.uz/uz/uz-UZ",
        },
    },
    openGraph: {
        title: "MIRRR",
        description: "MIRRR's blog website",
        url: "https://blog.mirrr.uz",
        siteName: "MIRRR",
        images: [{ url: "https://blog.mirrr.uz/en/og.png" }],
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#d4623b",
    colorScheme: "dark",
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params?: Promise<{ locale?: string }>;
}) {
    const locale = (await params)?.locale ?? "en";
    return (
        <html lang={locale} suppressHydrationWarning>
            <body className="antialiased">{children}</body>
        </html>
    );
}
