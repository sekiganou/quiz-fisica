/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://100.100.229.72:3000"]
    
}

export default nextConfig
