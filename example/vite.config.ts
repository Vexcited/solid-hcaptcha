import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

/** Additional environment variables. */
const viteEnv = {};

/** Load variables from process environment variables. */
Object.keys(process.env).forEach((key) => {
  if (key.startsWith("VITE_")) {
    viteEnv[`import.meta.env.${key}`] = process.env[key];
  }
});


export default defineConfig({
  plugins: [solidPlugin()],
  define: viteEnv,

  build: {
    target: "esnext",
    polyfillDynamicImport: false
  },

  /** Based on the GitHub Pages deploy URL. */
  base: "/solid-hcaptcha/"
});
