/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // The line 'output: 'export',' has been removed
  images: {
    unoptimized: true,
  },
};

export default nextConfig;