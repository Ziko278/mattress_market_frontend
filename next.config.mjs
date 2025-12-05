/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: 'standalone',
  images: {
    domains: ['api.mattressmarket.ng'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;