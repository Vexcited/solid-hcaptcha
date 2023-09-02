import { defineConfig, presetUno } from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";

export default defineConfig({
  presets: [
    presetRemToPx(),
    presetUno()
  ]
});
