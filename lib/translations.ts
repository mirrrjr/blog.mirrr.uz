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

        footer_copyright: '© 2021-{year} MIRRR :: Powered by Next.js :: Theme by Terminus',
    },
    uz: {
        nav_blog: 'bloglar',
        nav_archive: 'arxiv',
        nav_tags: 'teglar',
        nav_projects: 'loyihalar',
        nav_github: 'github',

        hero_title: 'Assalawmu aleykum! 👋',
        hero_intro: 'Mening ismim Mirsolih — veb ilovalar qurishni va Linux bilan shug\'ullanishni yoqtiruvchi backendga yo\'naltirilgan dasturchi. Mening asosiy stackim server tomonida Laravel & PHP va front tomon React / Next.js dan iborat.',
        hero_hobby: 'Kod yozmasdan turgan vaqtimda, ehtimol Linux distrolari bilan shug\'ullanaman, o\'zimning configlarimni moslashtiraman.',
        hero_cta: 'Mening blogimni tekshiring, loyihalarimni ko\'rib chiqing yoki shunchaki salom ayting.',

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

        footer_copyright: '© 2021-{year} MIRRR :: Powered by Next.js :: Theme by Terminus',
    },
}

export function t(locale: Locale, key: string): string {
    return translations[locale][key] || translations.en[key] || key
}
