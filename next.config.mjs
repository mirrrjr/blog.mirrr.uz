/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

const nextConfig = {
    output: 'export',
    basePath: isCustomDomain ? '' : '/blog',
    assetPrefix: isCustomDomain ? '' : '/blog',
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
        domains: ['*']
    },
}

export default nextConfig
