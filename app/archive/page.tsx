import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PostCard } from "@/components/post-card";
import { blogPosts } from "@/lib/blog-data";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Archive | MIRRR",
    description: "All blog posts",
};

export default function ArchivePage() {
    const sortedPosts = [...blogPosts].sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
    );

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-mono font-bold text-primary mb-12">
                    Archive
                </h1>

                <div className="space-y-6">
                    {sortedPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

                {sortedPosts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No posts yet.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
