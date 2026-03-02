import { AtSign, GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";
import Link from "next/link";

export function Footer() {
    const socialLinks = [
        {
            id: "email",
            icon: <MailIcon />,
            href: "mailto:mirrrrjr@gmail.com",
            label: "Email",
        },
        {
            id: "github",
            icon: <GithubIcon />,
            href: "https://github.com/mirrrjr",
            label: "GitHub",
        },
        {
            id: "linkedin",
            icon: <LinkedinIcon />,
            href: "https://linkedin.com/in/mirrrjr",
            label: "LinkedIn",
        },
        {
            id: "bluesky",
            icon: <AtSign />,
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
                            className="text-primary hover:text-accent transition-colors text-lg"
                            aria-label={link.label}
                        >
                            {link.icon}
                        </Link>
                    ))}
                </div>

                <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
                    <p>
                        © 2021-{new Date().getFullYear()} MIRRR :: Powered by
                        Next.js :: Theme by Terminus
                    </p>
                </div>
            </div>
        </footer>
    );
}
