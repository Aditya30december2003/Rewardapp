// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "rewardapp.hivefinty.com","rewardapp.hostsuite.teamhup.com"],
    },
  },
  eslint: { ignoreDuringBuilds: true },

  // Remove CSP here; middleware handles it with a nonce now.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // If you still want to keep non-CSP headers here, you can,
          // but it's cleaner to keep them in middleware with CSP.
        ],
      },
    ];
  },
};

export default nextConfig;
