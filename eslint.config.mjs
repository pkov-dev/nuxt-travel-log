import antfu from "@antfu/eslint-config";

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(antfu({
  type: "app",
  typescript: true,
  formatters: true,

  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["./src/github/schema.docs.graphql"],
}, {
  rules: {
    "ts/no-redeclare": "off",
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "antfu/no-top-level-await": ["off"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "perfectionist/sort-imports": ["error", {
      tsconfig: {
        rootDir: ".",
      },
    }],
    "unicorn/filename-case": ["error", {
      cases: {
        kebabCase: true,
        pascalCase: true,
      },
      ignore: ["README.md"],
    }],
  },
}),
);
