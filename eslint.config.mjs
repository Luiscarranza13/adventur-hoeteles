import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Reglas personalizadas
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn", // de error a warning
      "@next/next/no-img-element": "warn",        // de error a warning
    },
  },
]);

export default eslintConfig;