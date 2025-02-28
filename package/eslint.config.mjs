import stylistic from "@stylistic/eslint-plugin";
import typescript from "@typescript-eslint/parser";
import perfectionist from "eslint-plugin-perfectionist";

export default [
  { // Ignore the `dist` directory.
    ignores: [
      "dist/*"
    ]
  },
  { // Apply to `cjs`, `.mjs` and `.js` files.
    files: ["**/*.?([cm])js"]
  },
  { // Apply to `.ts` files.
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescript,
      parserOptions: {
        sourceType: "module"
      }
    }
  },
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/arrow-spacing": "error",
      "@stylistic/block-spacing": ["error", "always"],
      "@stylistic/brace-style": ["error", "stroustrup"],
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/comma-spacing": ["error", { after: true, before: false }],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/function-call-spacing": ["error", "never"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"]
    }
  },
  perfectionist.configs["recommended-alphabetical"]
];
