/** @type {import('next').NextConfig} */

let nextConfig;
if (process.env.NODE_ENV !== "production") {
  nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "upload-service",
          port: "8000",
        },
        {
          protocol: "http",
          hostname: "localhost",
          port: "8000",
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
      ],
    },
  };
} else {
  nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "educraft_upload_service",
          port: "8000",
        },
        {
          protocol: "https",
          hostname: "upload.mickaeldesbiens.com",
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
      ],
    },
    output: "standalone",
  };
}

export default nextConfig;
