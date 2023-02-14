/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: {
//     transpilePackages: [
//       "react-syntax-highlighter",
//       "swagger-client",
//       "swagger-ui-react",
//     ],
//   },
// };

// module.exports = nextConfig;

// const withMDX = require("@next/mdx")({
//   extension: /\.mdx?$/,
//   options: {
//     // If you use remark-gfm, you'll need to use next.config.mjs
//     // as the package is ESM only
//     // https://github.com/remarkjs/remark-gfm#install
//     remarkPlugins: [],
//     rehypePlugins: [],
//     // If you use `MDXProvider`, uncomment the following line.
//     // providerImportSource: "@mdx-js/react",
//   },
// });

// module.exports = withMDX({
//   // Append the default value with md extensions
//   pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: {
//     transpilePackages: [
//       "react-syntax-highlighter",
//       "swagger-client",
//       "swagger-ui-react",
//     ],
//   },
// });

import remarkGfm from "remark-gfm";
import nextMdx from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  swcMinify: true,
  experimental: {
    transpilePackages: [
      "react-syntax-highlighter",
      "swagger-client",
      "swagger-ui-react",
    ],
  },
  output: 'standalone'
};

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
