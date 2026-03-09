// This file is kept for backward compatibility
// The blog posts are now loaded from /lib/blog-loader.ts which supports i18n

export { type BlogPost, getPostsByLocale, getPostBySlugAndLocale, getAllPostSlugs, generateStaticParams } from './blog-loader'

// For quick access, export English posts
import { getPostsByLocale } from './blog-loader'

export const blogPosts = getPostsByLocale('en')
