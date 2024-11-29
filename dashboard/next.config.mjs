/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "notjustdev-dummy.s3.us-east-2.amazonaws.com",
      "www.apple.com",
      "garmin.ua",
    ],
  },
};

export default nextConfig;
