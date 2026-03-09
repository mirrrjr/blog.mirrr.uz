import React from "react";
import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
    title: "MIRRR | Developer Blog",
    description:
        "A minimal developer blog with a terminal-inspired aesthetic. Thoughts on code, math, and technology.",
    generator: "Next.js",
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
