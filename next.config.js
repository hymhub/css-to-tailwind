/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  basePath: '/css-to-tailwind',
  assetPrefix: `/css-to-tailwind/`,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }]
    })

    return config
  }
}

module.exports = nextConfig
