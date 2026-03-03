import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | MIRRR",
    description: "My projects and work",
};

type Project = {
    id: number;
    title: string;
    description: string;
    github: string;
    demo: string;
};
const projects: Project[] = [
    {
        id: 1,
        title: "Blog",
        description:
            "A minimal developer blog theme with a terminal-inspired aesthetic. Built with Next.js, TypeScript, and Tailwind CSS.",
        github: "https://github.com/mirrrjr/blog.mirrr.uz",
        demo: "https://blog.mirrr.uz",
    },
];

export default function ProjectsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-mono font-bold text-primary mb-12">
                    Projects
                </h1>

                <div className="space-y-8">
                    {projects.map((project) => (
                        <div
                            className="border border-border p-6"
                            key={project.id}
                        >
                            <h2 className="text-xl font-mono font-semibold text-primary mb-2">
                                {project.title}
                            </h2>
                            <p className="text-foreground mb-4">
                                {project.description}
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-accent underline text-sm"
                                >
                                    GitHub →
                                </Link>
                                <Link
                                    href={project.demo}
                                    className="text-primary hover:text-accent underline text-sm"
                                >
                                    Demo →
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* <div className="border border-border p-6">
            <h2 className="text-xl font-mono font-semibold text-primary mb-2">Your Other Project</h2>
            <p className="text-muted-foreground text-sm">
              Add your projects here! Edit the <code className="bg-secondary px-2 py-1 rounded">app/projects/page.tsx</code> file to customize this page.
            </p>
          </div> */}
                </div>
            </main>

            <Footer />
        </div>
    );
}
