"use client";

import { useMemo, useEffect } from "react";
import Image from "next/image";
import { CodeBlock } from "./code-block";

declare global {
    interface Window {
        MathJax?: {
            typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
        };
    }
}

interface MarkdownRendererProps {
    content: string;
}

interface ParsedContent {
    html: string;
    codeBlocks: Array<{ code: string; language: string }>;
    images: Array<{ src: string; alt: string }>;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const parsed = useMemo<ParsedContent>(() => {
        let result = content;
        const codeBlocks: Array<{ code: string; language: string }> = [];
        const images: Array<{ src: string; alt: string }> = [];

        // -------------------------
        // 1️⃣ Code blocks (extract first)
        // -------------------------
        result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            const trimmedCode = code.trim();
            codeBlocks.push({
                code: trimmedCode,
                language: lang || "code",
            });
            return `__CODE_${codeBlocks.length - 1}__`;
        });

        // -------------------------
        // 2️⃣ Images (before links)
        // -------------------------
        result = result.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, src) => {
            images.push({ alt, src });
            return `__IMAGE_${images.length - 1}__`;
        });

        // -------------------------
        // 3️⃣ Headers
        // -------------------------
        result = result.replace(
            /^### (.*?)$/gm,
            '<h3 class="text-lg font-semibold font-mono text-primary mt-6 mb-3">$1</h3>',
        );
        result = result.replace(
            /^## (.*?)$/gm,
            '<h2 class="text-2xl font-semibold font-mono text-primary mt-8 mb-4">$1</h2>',
        );
        result = result.replace(
            /^# (.*?)$/gm,
            '<h1 class="text-3xl font-semibold font-mono text-primary mt-8 mb-4">$1</h1>',
        );

        // -------------------------
        // 4️⃣ Lists
        // -------------------------
        result = result.replace(/((?:^\s*-\s+.*$\n?)+)/gm, (match) => {
            const items = match
                .trim()
                .split("\n")
                .map((line) => `<li>${line.replace(/^\s*-\s+/, "")}</li>`)
                .join("");
            return `<ul class="list-disc ml-6 my-4">${items}</ul>`;
        });

        result = result.replace(/((?:^\s*\d+\.\s+.*$\n?)+)/gm, (match) => {
            const items = match
                .trim()
                .split("\n")
                .map((line) => `<li>${line.replace(/^\s*\d+\.\s+/, "")}</li>`)
                .join("");
            return `<ol class="list-decimal ml-6 my-4">${items}</ol>`;
        });

        // tables
        result = result.replace(/((?:^\|.+\|\n?)+)/gm, (match) => {
            const rows = match
                .trim()
                .split("\n")
                .filter((row) => !/^\|[\s-|]+\|$/.test(row));

            const [headerRow, ...bodyRows] = rows;

            const parseRow = (row: string, tag: string) =>
                `<tr>${row
                    .split("|")
                    .filter((_, i, arr) => i > 0 && i < arr.length - 1)
                    .map(
                        (cell) =>
                            `<${tag} class="border border-border px-3 py-2 text-left">${cell.trim()}</${tag}>`,
                    )
                    .join("")}</tr>`;

            const thead = `<thead class="bg-muted">${parseRow(headerRow, "th")}</thead>`;
            const tbody = `<tbody>${bodyRows.map((r) => parseRow(r, "td")).join("")}</tbody>`;

            return `<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-border text-sm">${thead}${tbody}</table></div>`;
        });

        // -------------------------
        // 5️⃣ Bold / Italic
        // -------------------------
        result = result.replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-semibold text-primary">$1</strong>',
        );
        result = result.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

        // -------------------------
        // 6️⃣ Inline code
        // -------------------------
        result = result.replace(
            /`([^`]+)`/g,
            '<code class="bg-secondary px-2 py-1 rounded text-sm font-mono text-primary">$1</code>',
        );

        // -------------------------
        // 7️⃣ Blockquotes
        // -------------------------
        result = result.replace(
            /^> (.*)$/gm,
            '<blockquote class="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">$1</blockquote>',
        );

        // -------------------------
        // 8️⃣ Links
        // -------------------------
        result = result.replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" class="text-primary hover:text-accent underline">$1</a>',
        );

        // -------------------------
        // 9️⃣ Paragraph handling
        // -------------------------
        result = result.replace(/\n{2,}/g, '</p><p class="my-4">');
        result = `<p class="my-4">${result}</p>`;

        // cleanup
        result = result.replace(/<p class="my-4"><\/p>/g, "");
        result = result.replace(
            /<p class="my-4">(<h[1-3]|<ul|<ol|<blockquote)/g,
            "$1",
        );
        result = result.replace(
            /(<\/h[1-3]>|<\/ul>|<\/ol>|<\/blockquote>)<\/p>/g,
            "$1",
        );
        result = result.replace(/<p class="my-4">(__CODE_|__IMAGE_)/g, "$1");
        result = result.replace(/(__CODE_\d+__|__IMAGE_\d+__)<\/p>/g, "$1");

        return { html: result, codeBlocks, images };
    }, [content]);

    useEffect(() => {
        if (window.MathJax?.typesetPromise) {
            window.MathJax.typesetPromise().catch(() => {});
        }
    }, [parsed]);

    return (
        <div className="prose prose-invert max-w-none">
            {parsed.html
                .split(/__(CODE|IMAGE)_(\d+)__/)
                .map((segment, index, arr) => {
                    if (index % 3 === 0) {
                        return segment ? (
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{ __html: segment }}
                            />
                        ) : null;
                    }

                    const type = segment;
                    const itemIndex = parseInt(arr[index + 1]);

                    if (type === "CODE") {
                        const block = parsed.codeBlocks[itemIndex];
                        return block ? (
                            <CodeBlock
                                key={`code-${itemIndex}`}
                                code={block.code}
                                language={block.language}
                            />
                        ) : null;
                    }

                    if (type === "IMAGE") {
                        const img = parsed.images[itemIndex];
                        return img ? (
                            <div key={`img-${itemIndex}`} className="my-6">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    width={900}
                                    height={500}
                                    className="rounded-xl"
                                />
                            </div>
                        ) : null;
                    }

                    return null;
                })}
        </div>
    );
}
