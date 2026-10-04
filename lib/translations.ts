import type { Locale } from './i18n'

export const translations: Record<Locale, Record<string, string>> = {
    en: {
        nav_blog: 'blog',
        nav_archive: 'archive',
        nav_tags: 'tags',
        nav_projects: 'projects',
        nav_github: 'github',

        hero_title: 'Hello there! 👋',
        hero_intro: 'I\'m Mirsoli — a backend-focused developer who enjoys building things on the web and tinkering with Linux. My primary stack revolves around Laravel & PHP on the server side, and React / Next.js on the front.',
        hero_hobby: 'When I\'m not writing code, I\'m probably hopping between Linux distros, customizing my setup, or reading about systems I\'ll never have time to fully explore.',
        hero_cta: 'Feel free to look around — check out my blog, browse my projects, or just say hi.',

        link_blog: 'blog',
        link_projects: 'projects',
        link_hi: 'hi',

        latest_post: 'Latest Post',
        more_posts: 'More Posts',
        read_more: 'Read More Posts →',

        archive_title: 'Archive',
        archive_empty: 'No posts yet.',

        tags_title: 'Tags',
        tags_empty: 'No tags yet.',

        projects_title: 'Projects',
        projects_empty: 'No projects yet.',

        next_post: 'Next Post',

        footer_copyright: '© 2021-{year} MIRRR :: Powered by Next.js',
    },
    uz: {
        nav_blog: 'bloglar',
        nav_archive: 'arxiv',
        nav_tags: 'teglar',
        nav_projects: 'loyihalar',
        nav_github: 'github',

        hero_title: 'Assalomu alaykum! 👋',
        hero_intro: 'Men Mirsolihman — veb ilovalar yaratish va Linux bilan shug\'ullanishni yaxshi ko\'radigan backend dasturchi. Asosiy stackim: serverda Laravel va PHP, frontendda React / Next.js.',
        hero_hobby: 'Kod yozmayotgan paytlarim, ehtimol, Linux distrolarini sinab ko\'rayotgan yoki o\'z configlarimni sozlayotgan bo\'laman.',
        hero_cta: 'Blogimni o\'qing, loyihalarim bilan tanishing yoki shunchaki salom yozing.',

        link_blog: 'bloglar',
        link_projects: 'loyihalar',
        link_hi: 'salom',

        latest_post: 'Eng yangi post',
        more_posts: 'Boshqa postlar',
        read_more: 'Ko\'proq postlarni o\'qish →',

        archive_title: 'Arxiv',
        archive_empty: 'Hali postlar yo\'q.',

        tags_title: 'Teglar',
        tags_empty: 'Hali teglar yo\'q.',

        projects_title: 'Loyihalar',
        projects_empty: 'Hali loyihalar yo\'q.',

        next_post: 'Keyingi post',

        footer_copyright: '© 2021-{year} MIRRR :: Next.js asosida',
    },
}

export function t(locale: Locale, key: string): string {
    return translations[locale][key] || translations.en[key] || key
}
