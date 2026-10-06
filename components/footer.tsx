import {
    PiButterfly,
    PiGithubLogoBold,
    PiLinkedinLogoBold,
    PiMailboxBold,
} from "react-icons/pi";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/translations";

interface FooterProps {
    locale: Locale;
}

export function Footer({ locale }: FooterProps) {
    const socialLinks = [
        {
            id: "email",
            icon: <PiMailboxBold />,
            href: "mailto:mirrrrjr@gmail.com",
            label: "Email",
        },
        {
            id: "github",
            icon: <PiGithubLogoBold />,
            href: "https://github.com/mirrrjr",
            label: "GitHub",
        },
        {
            id: "linkedin",
            icon: <PiLinkedinLogoBold />,
            href: "https://linkedin.com/in/mirrrjr",
            label: "LinkedIn",
        },
        {
            id: "bluesky",
            icon: <PiButterfly />,
            href: "https://bsky.app/profile/mirrr.uz",
            label: "Bluesky",
        },
    ];

    return (
        <footer className="border-t border-border bg-background mt-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-center gap-6 mb-6">
                    {socialLinks.map((link) => (
                        <Link
                            key={link.id}
                            href={link.href}
                            title={link.label}
                            target={
                                link.href.startsWith("http")
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                link.href.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                            className="text-primary hover:text-accent transition-colors text-lg md:text-2xl lg:text-4xl"
                            aria-label={link.label}
                        >
                            {link.icon}
                        </Link>
                    ))}
                </div>

                <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
                    <p>
                        {t(locale, "footer_copyright").replace(
                            "{year}",
                            String(new Date().getFullYear()),
                        )}
                    </p>
                </div>
            </div>
        </footer>
    );
}
