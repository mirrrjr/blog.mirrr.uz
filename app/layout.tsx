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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">{children}</body>
        </html>
    );
}
