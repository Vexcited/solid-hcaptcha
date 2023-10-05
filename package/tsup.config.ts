import { defineConfig } from "tsup";
import { parsePresetOptions, generatePackageExports, writePackageJson, generateTsupOptions, type PresetOptions } from "tsup-preset-solid";

const preset_options: PresetOptions = {
  entries: {
    entry: "src/index.tsx"
  },

  // Remove all `console.*` calls and `debugger` statements in builds
  drop_console: true,
  // Don't build CJS version
  cjs: false
};

export default defineConfig(config => {
  const watching = !!config.watch;

  const parsed_data = parsePresetOptions(preset_options, watching);

  if (!watching) {
    const package_fields = generatePackageExports(parsed_data);
    writePackageJson(package_fields);
  }

  return generateTsupOptions(parsed_data).map((tsup_options) => {
    tsup_options.minify = true;
    tsup_options.sourcemap = true;
    return tsup_options;
  });
});