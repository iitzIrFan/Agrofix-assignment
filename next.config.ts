import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Optionally add these features if you want to use them
    // after: true, // Enable the 'after' API for executing code after response finishes
    // staleTimes: { // Configure router cache behavior if needed
    //   dynamic: 30,
    //   static: 180,
    // },
  },
  // Note: For Prisma to work properly on Vercel, ensure the build script
  // in package.json includes "prisma generate" before "next build"
};

export default nextConfig;
