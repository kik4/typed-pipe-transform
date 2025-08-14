import { defineConfig } from "tsup";

export default defineConfig((options) => {
  const isProduction = !options.watch;
  return {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: !isProduction,
    clean: true,
    minify: isProduction,
    target: "es2022",
    outDir: "dist",
  };
});
