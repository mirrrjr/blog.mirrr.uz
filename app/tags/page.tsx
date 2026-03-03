import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { blogPosts } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tags | MIRRR",
    description: "Browse posts by tag",
};

export default function TagsPage() {
    // Get all unique tags with their post counts
    const tagMap = new Map<string, number>();

    blogPosts.forEach((post) => {
        post.tags.forEach((tag) => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        });
    });

    const sortedTags = Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-mono font-bold text-primary mb-12">
                    Tags
                </h1>

                <div className="flex flex-wrap gap-4">
                    {sortedTags.map(([tag, count]) => (
                        <Link
                            key={tag}
                            href={`/tags/${tag}`}
                            className="px-4 py-2 border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                        >
                            <span className="font-mono font-semibold">
                                #{tag}
                            </span>
                            <span className="ml-2 text-sm text-muted-foreground">
                                ({count})
                            </span>
                        </Link>
                    ))}
                </div>

                {sortedTags.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No tags yet.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
