"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSwitcher } from "./language-switcher";
import { type Locale, DEFAULT_LOCALE } from "@/lib/i18n";
import { t } from "@/lib/translations";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

function getLocaleFromPathname(pathname: string): Locale {
    const match = pathname.match(/^\/(en|uz)/);
    return (match?.[1] as Locale) || DEFAULT_LOCALE;
}

export function Header() {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const locale = getLocaleFromPathname(pathname);

    const navItems = [
        { href: `/${locale}/`, label: t(locale, "nav_blog") },
        { href: `/${locale}/archive`, label: t(locale, "nav_archive") },
        { href: `/${locale}/tags`, label: t(locale, "nav_tags") },
        { href: `/${locale}/projects`, label: t(locale, "nav_projects") },
        {
            href: "https://github.com/mirrrjr",
            label: t(locale, "nav_github"),
            external: true,
        },
    ];

    return (
        <header className="bg-background border-b border-border">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top row: Logo and decorative bars as flex-grow filler */}
                <div className="flex items-center gap-3 py-4">
                    {/* Logo */}
                    <Link
                        href={`/${locale}/`}
                        className="flex items-center flex-shrink-0"
                    >
                        <span className="logo bg-primary text-primary-foreground font-bold font-mono text-base sm:text-lg px-4 py-2 leading-none">
                            MIRRR
                        </span>
                    </Link>

                    {/* Decorative bars - flex-grow filler (desktop only) */}
                    <div className="hidden sm:flex items-center flex-1 overflow-hidden whitespace-nowrap leading-none gap-px">
                        <span
                            className="font-mono text-base sm:text-lg text-primary flex-1"
                            style={{
                                letterSpacing: "0.1em",
                                overflow: "hidden",
                                textOverflow: "clip",
                            }}
                        >
                            {"|".repeat(100)}
                        </span>
                    </div>

                    {/* Mobile: Decorative bars and dropdown */}
                    {isMobile && (
                        <>
                            <div className="flex items-center flex-1 overflow-hidden whitespace-nowrap leading-none gap-px">
                                <span
                                    className="font-mono text-base text-primary flex-1"
                                    style={{
                                        letterSpacing: "0.1em",
                                        overflow: "hidden",
                                        textOverflow: "clip",
                                    }}
                                >
                                    {"|".repeat(100)}
                                </span>
                            </div>

                            {/* Dropdown menu for mobile */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 hover:bg-muted rounded transition-colors">
                                        <Menu className="w-5 h-5 text-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    {navItems.map((item) => (
                                        <DropdownMenuItem
                                            key={item.href}
                                            asChild
                                        >
                                            <Link
                                                href={item.href}
                                                target={
                                                    item.external
                                                        ? "_blank"
                                                        : undefined
                                                }
                                                rel={
                                                    item.external
                                                        ? "noopener noreferrer"
                                                        : undefined
                                                }
                                                className={`w-full cursor-pointer ${
                                                    pathname === item.href &&
                                                    !item.external
                                                        ? "bg-primary text-primary-foreground"
                                                        : ""
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem
                                        asChild
                                        className="border-t bg-transparent focus:bg-transparent"
                                    >
                                        <div className="w-full flex gap-2 items-center justify-center p-2">
                                            <LanguageSwitcher
                                                currentLocale={locale}
                                            />
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>

                {/* Navigation row (desktop only) */}
                {!isMobile && (
                    <nav className="flex gap-4 sm:gap-6 pb-4 justify-between items-center">
                        <div className="flex gap-4 sm:gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    target={
                                        item.external ? "_blank" : undefined
                                    }
                                    rel={
                                        item.external
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className={`text-sm underline transition-colors ${
                                        pathname === item.href && !item.external
                                            ? "text-primary font-semibold"
                                            : "text-foreground hover:text-primary"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <LanguageSwitcher currentLocale={locale} />
                    </nav>
                )}
            </div>
        </header>
    );
}
