import fs from 'fs'
import path from 'path'
import type { Locale } from './i18n'
import { DEFAULT_LOCALE } from './i18n'

export interface BlogPost {
  id: string
  slug: string
  title: string
  date: Date
  author: string
  readingTime: number
  tags: string[]
  excerpt: string
  content: string
  locale: Locale
}

interface FrontMatter {
  id?: string
  title?: string
  date?: string
  author?: string
  readingTime?: number
  tags?: string[]
  excerpt?: string
}

function parseFrontMatter(str: string): FrontMatter {
  const result: FrontMatter = {}
  const lines = str.split('\n')

  for (const line of lines) {
    if (!line.trim()) continue

    const [key, ...valueParts] = line.split(':')
    const value = valueParts.join(':').trim()

    if (key.trim() === 'tags') {
      result.tags = value
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(t => t.trim())
    } else if (key.trim() === 'readingTime') {
      result.readingTime = parseInt(value)
    } else {
      result[key.trim() as keyof FrontMatter] = value as any
    }
  }

  return result
}

function parseMarkdownPost(
  content: string,
  slug: string,
  locale: Locale
): BlogPost | null {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  if (!match) {
    return null
  }

  const [, frontMatterStr, postContent] = match
  const frontMatter = parseFrontMatter(frontMatterStr)

  return {
    id: frontMatter.id || slug,
    slug,
    title: frontMatter.title || 'Untitled',
    date: new Date(frontMatter.date || new Date()),
    author: frontMatter.author || 'Unknown',
    readingTime:
      frontMatter.readingTime ||
      Math.ceil(postContent.split(' ').length / 200),
    tags: frontMatter.tags || [],
    excerpt: frontMatter.excerpt || postContent.substring(0, 150),
    content: postContent.trim(),
    locale,
  }
}

function loadPostsByLocale(locale: Locale): BlogPost[] {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/posts')

    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const directories = fs
      .readdirSync(postsDirectory)
      .filter(f => {
        const fullPath = path.join(postsDirectory, f)
        return fs.statSync(fullPath).isDirectory()
      })

    const posts: BlogPost[] = []

    for (const dir of directories) {
      const localeFile = path.join(postsDirectory, dir, `${locale}.md`)
      const fallbackFile = path.join(postsDirectory, dir, `${DEFAULT_LOCALE}.md`)

      // Try to load the requested locale, fallback to default
      const fileToRead = fs.existsSync(localeFile) ? localeFile : fallbackFile

      if (fs.existsSync(fileToRead)) {
        const content = fs.readFileSync(fileToRead, 'utf-8')
        const post = parseMarkdownPost(content, dir, locale)
        if (post) {
          posts.push(post)
        }
      }
    }

    return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (error) {
    console.error(`Error loading posts for locale ${locale}:`, error)
    return []
  }
}

// Cache for posts by locale
const postsCache: Map<Locale, BlogPost[]> = new Map()

export function getPostsByLocale(locale: Locale): BlogPost[] {
  if (!postsCache.has(locale)) {
    postsCache.set(locale, loadPostsByLocale(locale))
  }
  return postsCache.get(locale) || []
}

export function getPostBySlugAndLocale(
  slug: string,
  locale: Locale
): BlogPost | null {
  const posts = getPostsByLocale(locale)
  return posts.find(p => p.slug === slug) || null
}

export function getAllPostSlugs(): string[] {
  try {
    const postsDirectory = path.join(process.cwd(), 'content/posts')
    if (!fs.existsSync(postsDirectory)) {
      return []
    }
    return fs
      .readdirSync(postsDirectory)
      .filter(f => {
        const fullPath = path.join(postsDirectory, f)
        return fs.statSync(fullPath).isDirectory()
      })
  } catch (error) {
    console.error('Error getting post slugs:', error)
    return []
  }
}

export function generateStaticParams() {
  const slugs = getAllPostSlugs()
  const params: Array<{ locale: Locale; slug: string }> = []

  for (const slug of slugs) {
    params.push({ locale: 'en', slug })
    params.push({ locale: 'uz', slug })
  }

  return params
}
