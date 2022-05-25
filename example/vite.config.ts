import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  
  /** Global variables. */
  define: {
    HCAPTCHA_SITEKEY: JSON.stringify("1cfa7710-ea6d-4734-bf4f-489e27fcb4eb")
  },

  build: {
    target: "esnext",
    polyfillDynamicImport: false
  },

  /** Based on the GitHub Pages deploy URL. */
  base: "/solid-hcaptcha/",

  /** Allow serving files from one level up to the project root. */
  server: {
    fs: {
      allow: [".."]
    }
  }
});
