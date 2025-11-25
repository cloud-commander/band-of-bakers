import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // External libraries
    "public/tinymce/**",
    // Build outputs and dependencies
    "node_modules/**",
    ".env*",
    "*.log",
    "build_log.txt",
    // IDE files
    ".vscode/**",
    ".idea/**",
    // OS files
    ".DS_Store",
    "Thumbs.db",
  ]),
]);

export default eslintConfig;
