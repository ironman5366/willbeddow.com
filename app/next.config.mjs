/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{
      source: "/research/entropybench",
      destination: "/research/entropybench/results.html",
    }];
  },
  async headers() {
    return [{
      source: "/research/entropybench/data/:path*",
      headers: [
        { key: "Content-Encoding", value: "gzip" },
        { key: "Content-Type", value: "application/json; charset=utf-8" },
      ],
    }];
  },
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
};

export default nextConfig;
