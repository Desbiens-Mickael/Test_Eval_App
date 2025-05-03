/** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "upload-service",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost:8000",
//         // port: "8000",
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//       },
//     ],
//   },
// };

let nextConfig;
if (process.env.NODE_ENV !== "production") {
  nextConfig = {
    // -------- Pour le dev avec Docker ----------
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "upload-service",
        },
        {
          protocol: "http",
          hostname: "localhost:8000",
          // port: "8000",
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com",
        },
      ],
    },
    // -------------------------------------------
  };
} else {
  nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "upload-service",
        },
        {
          protocol: "http",
          hostname: "localhost:8000",
          // port: "8000",
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
