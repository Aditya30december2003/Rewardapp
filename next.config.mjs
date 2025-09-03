/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "rewardapp.hivefinty.com","rewardapp.hostsuite.teamhup.com"],
    },
  },
  eslint: { ignoreDuringBuilds: true },

  // IMPORTANT: Do NOT set CSP here anymore; middleware sets it dynamically.
  // If you want to keep other static headers here, ensure the list is non-empty.
  // For now, we return nothing.
  async headers() {
    return [];
  },
};

export default nextConfig;
