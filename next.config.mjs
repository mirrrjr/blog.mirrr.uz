/** @type {import('next').NextConfig} */

const nextConfig = {
    // basePath: '/blog',
    // assetPrefix: '/blog/',
    output: 'export',
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
        domains: ['*']
    },
}

export default nextConfig
