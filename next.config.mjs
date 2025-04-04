// next.config.mjs

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  },
  // INFO:重写 /dao-docs 开头的请求到对应的 /dao-docs/docs/intro/ 子目录
  async rewrites() {
    return [
      // 重写 /docs 开头的请求到对应的 /docs/intro/ 子目录
      {
        source: '/dao-docs/:path*',
        destination: '/dao-docs/docs/intro/index.html', // 直接映射到 /index.html
      },
      // 针对静态资源（JS/CSS 等），重新定位到 /assets/
      {
        source: '/assets/:path*',
        destination: '/./public/assets/:path*', // 映射到 public/assets
      },
    ];
  },
  staticPageGenerationTimeout: 180,
}

export default nextConfig