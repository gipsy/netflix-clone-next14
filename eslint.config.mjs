import { createRequire } from "module";

const require = createRequire(import.meta.url);

const nextConfig = require("eslint-config-next/core-web-vitals");

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "eslint.config.mjs"],
  },
  ...nextConfig,
];

export default eslintConfig;
