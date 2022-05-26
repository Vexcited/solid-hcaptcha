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

  /** GitHub Pages deploy sub-path. */
  base: "/solid-hcaptcha/",

  server: {
    /**
     * Allow serving files from one level up to the project root.
     * Useful when testing the build with `pnpm add ..`.
     */
    fs: {
      allow: [".."]
    },

    /**
     * Vite runs at port 3000 but as I use a reverse proxy,
     * the website is served at HTTPS, on port 443.
     * To fix HMR, I have to set the `clientPort` at `443` here.
     */
    hmr: {
      clientPort: 443
    }
  }
});
